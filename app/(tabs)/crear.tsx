import { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CrearEventoScreen() {
  const [titulo, setTitulo] = useState('');
  const [lugar, setLugar] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState<Date | null>(null);
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [tipo, setTipo] = useState<'gratis' | 'pago'>('gratis');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [usarLink, setUsarLink] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [openCategoria, setOpenCategoria] = useState(false);
  const [categorias, setCategorias] = useState([
    { label: 'Comida', value: 'comida' },
    { label: 'Deporte', value: 'deporte' },
    { label: 'Arte', value: 'arte' }
  ]);

  const router = useRouter();

  const elegirImagen = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled && res.assets.length > 0) {
      setImagen(res.assets[0].uri);
    }
  };

  const crearEvento = () => {
    if (!titulo || !lugar || !descripcion || !fecha || !imagen || !categoria) {
      return Alert.alert('Campos incompletos', 'Por favor completá todos los campos.');
    }

    const nuevoEvento = {
      id: Date.now().toString(),
      titulo,
      lugar,
      descripcion,
      fecha: fecha.toLocaleDateString(),
      tipo,
      precio: tipo === 'pago' ? precio : undefined,
      imagen,
      categoria,
    };

    router.push({ pathname: '/', params: { nuevo: JSON.stringify(nuevoEvento) } });

    // Limpiar el formulario
    setTitulo('');
    setLugar('');
    setDescripcion('');
    setFecha(null);
    setTipo('gratis');
    setPrecio('');
    setImagen(null);
    setCategoria('');
    setUsarLink(false);
  };

  const handleFechaChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setMostrarFecha(false);
    if (event.type === 'set' && selectedDate) {
      setFecha(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Título" placeholderTextColor="#555" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Lugar" placeholderTextColor="#555" value={lugar} onChangeText={setLugar} style={styles.input} />
      <TextInput placeholder="Descripción" placeholderTextColor="#555" value={descripcion} onChangeText={setDescripcion} style={styles.input} />

      <TouchableOpacity onPress={() => setMostrarFecha(true)}>
        <Text style={styles.link}>Seleccionar fecha</Text>
      </TouchableOpacity>
      {fecha && (
        <Text style={{ textAlign: 'center' }}>{fecha.toLocaleDateString()}</Text>
      )}
      {mostrarFecha && (
        <DateTimePicker
          value={fecha || new Date()}
          mode="date"
          display="calendar"
          onChange={handleFechaChange}
        />
      )}

      <DropDownPicker
        open={openCategoria}
        value={categoria}
        items={categorias}
        setOpen={setOpenCategoria}
        setValue={setCategoria}
        setItems={setCategorias}
        placeholder="Seleccionar categoría"
        style={styles.pickerDropdown}
        textStyle={{ color: '#000' }}
        dropDownDirection="BOTTOM"
        dropDownContainerStyle={{ borderColor: '#ccc' }}
      />

      {usarLink ? (
        <TextInput
          placeholder="URL de imagen"
          placeholderTextColor="#555"
          value={imagen || ''}
          onChangeText={setImagen}
          style={styles.input}
        />
      ) : (
        <TouchableOpacity onPress={elegirImagen}>
          <Text style={styles.link}>Elegir imagen desde galería</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => setUsarLink(!usarLink)}>
        <Text style={styles.link}>{usarLink ? 'Usar galería' : 'Usar un link de imagen'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setTipo(tipo === 'gratis' ? 'pago' : 'gratis')}>
        <Text style={styles.link}>
          Tipo: {tipo === 'gratis' ? 'GRATIS' : `PAGO${precio ? ` - $${precio}` : ''}`}
        </Text>
      </TouchableOpacity>

      {tipo === 'pago' && (
        <TextInput
          placeholder="Precio"
          placeholderTextColor="#555"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
          style={styles.input}
        />
      )}

      <Button title="Crear evento" onPress={crearEvento} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, color: '#000' },
  link: { color: '#007AFF', textAlign: 'center', marginVertical: 6 },
  pickerDropdown: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    backgroundColor: '#eee',
    marginTop: 5,
  },
});