
type Evento = {
  id: string;
  titulo: string;
  lugar: string;
  descripcion: string;
  tipo: 'gratis' | 'pago';
  precio?: string;
  fecha: string;
  imagen: string;
};

declare global {
  var createdEvents: Evento[] | undefined;
}

import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CrearEventoScreen() {
  const [titulo, setTitulo] = useState('');
  const [lugar, setLugar] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState<'gratis' | 'pago'>('gratis');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState<string>(''); // no puede ser null
  const [usarLink, setUsarLink] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const elegirImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitás permiso para acceder a la galería.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!res.canceled && res.assets.length > 0) {
      setImagen(res.assets[0].uri);
    }
  };

  const validarCampos = () => {
    const nuevosErrores: { [key: string]: string } = {};
    if (!titulo) nuevosErrores.titulo = 'Título requerido';
    if (!lugar) nuevosErrores.lugar = 'Lugar requerido';
    if (!descripcion) nuevosErrores.descripcion = 'Descripción requerida';
    if (!fecha) nuevosErrores.fecha = 'Fecha requerida';
    if (!imagen) nuevosErrores.imagen = 'Imagen requerida';
    if (tipo === 'pago' && !precio) nuevosErrores.precio = 'Precio requerido';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const crearEvento = () => {
    if (!validarCampos()) return;

    if (!Array.isArray(globalThis.createdEvents)) {
      globalThis.createdEvents = [];
    }

    const nuevoEvento: Evento = {
      id: Math.random().toString(36).substring(2, 10),
      titulo,
      lugar,
      descripcion,
      fecha,
      tipo,
      precio: tipo === 'pago' ? precio : undefined,
      imagen,
    };

    const duplicado = globalThis.createdEvents.some(
      (e) =>
        e.titulo === nuevoEvento.titulo &&
        e.lugar === nuevoEvento.lugar &&
        e.descripcion === nuevoEvento.descripcion &&
        e.fecha === nuevoEvento.fecha
    );

    if (duplicado) {
      Alert.alert('Evento duplicado', 'Este evento ya existe.');
      return;
    }

    globalThis.createdEvents.push(nuevoEvento);

    
    setTitulo('');
    setLugar('');
    setDescripcion('');
    setFecha('');
    setPrecio('');
    setImagen('');
    setTipo('gratis');
    setUsarLink(false);
    setErrores({});
    router.push({

      pathname: '/',
      params: { nuevo: JSON.stringify(nuevoEvento) },
    });
  };

  const inputStyle = (campo: string, valor: string) => [
    styles.input,
    errores[campo]
      ? { borderColor: 'red' }
      : valor.trim() !== ''
      ? { borderColor: 'green' }
      : { borderColor: '#ccc' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={inputStyle('titulo', titulo)}
      />
      {errores.titulo && <Text style={styles.error}>{errores.titulo}</Text>}

      <TextInput
        placeholder="Lugar"
        value={lugar}
        onChangeText={setLugar}
        style={inputStyle('lugar', lugar)}
      />
      {errores.lugar && <Text style={styles.error}>{errores.lugar}</Text>}

      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={inputStyle('descripcion', descripcion)}
      />
      {errores.descripcion && <Text style={styles.error}>{errores.descripcion}</Text>}

      <TextInput
        placeholder="Fecha"
        value={fecha}
        onChangeText={setFecha}
        style={inputStyle('fecha', fecha)}
      />
      {errores.fecha && <Text style={styles.error}>{errores.fecha}</Text>}

      <TouchableOpacity onPress={() => setUsarLink(!usarLink)} style={styles.toggleButton}>
        <Text style={{ color: '#007AFF' }}>
          {usarLink ? '⬅ Volver a seleccionar imagen' : 'Usar un link de imagen'}
        </Text>
      </TouchableOpacity>

      {usarLink ? (
        <TextInput
          placeholder="https://ejemplo.com/imagen.jpg"
          value={imagen}
          onChangeText={setImagen}
          style={inputStyle('imagen', imagen)}
        />
      ) : (
        <Button title="Elegir imagen desde galería" onPress={elegirImagen} />
      )}

      {errores.imagen && <Text style={styles.error}>{errores.imagen}</Text>}
      {imagen && <Image source={{ uri: imagen }} style={styles.imagen} />}

      <Button
        title={`Tipo: ${tipo === 'gratis' ? 'GRATIS' : 'PAGO'}`}
        onPress={() => setTipo(tipo === 'gratis' ? 'pago' : 'gratis')}
      />

      {tipo === 'pago' && (
        <>
          <TextInput
            placeholder="Precio"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
            style={inputStyle('precio', precio)}
          />
          {errores.precio && <Text style={styles.error}>{errores.precio}</Text>}
          {precio !== '' && (
            <Text style={styles.pricePreview}>Precio ingresado: ${precio}</Text>
          )}
        </>
      )}

      <Button title="Crear evento" onPress={crearEvento} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
  },
  pricePreview: {
    color: 'green',
    marginBottom: 4,
    marginLeft: 4,
  },
  toggleButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
});
