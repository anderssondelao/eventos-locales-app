import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CrearEventoScreen() {
  const [titulo, setTitulo] = useState('');
  const [lugar, setLugar] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState<'gratis' | 'pago'>('gratis');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);

  const router = useRouter();

  const elegirImagen = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!res.canceled && res.assets.length > 0) {
      setImagen(res.assets[0].uri);
    }
  };

  const crearEvento = () => {
    if (!titulo || !lugar || !descripcion || !fecha || !imagen) {
      return Alert.alert('Campos incompletos', 'Por favor completá todos los campos.');
    }

    const nuevoEvento = {
      id: Date.now().toString(),
      titulo,
      lugar,
      descripcion,
      fecha,
      tipo,
      precio: tipo === 'pago' ? precio : undefined,
      imagen,
    };

    router.push({
      pathname: '/',
      params: { nuevo: JSON.stringify(nuevoEvento) },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Lugar" value={lugar} onChangeText={setLugar} style={styles.input} />
      <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={styles.input} />
      <TextInput placeholder="Fecha" value={fecha} onChangeText={setFecha} style={styles.input} />
      <Button title="Elegir imagen" onPress={elegirImagen} />
      {imagen && <Image source={{ uri: imagen }} style={styles.imagen} />}
      <Button
        title={`Tipo: ${tipo === 'gratis' ? 'GRATIS' : `PAGO - ${precio || ''}`}`}
        onPress={() => setTipo(tipo === 'gratis' ? 'pago' : 'gratis')}
      />
      {tipo === 'pago' && (
        <TextInput
          placeholder="Precio"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
          style={styles.input}
        />
      )}
      <Button title="Crear evento" onPress={crearEvento} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    rowGap: 10, // alternativa a "gap" que sí funciona
  },
  input: {
    borderWidth: 1,
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
});
