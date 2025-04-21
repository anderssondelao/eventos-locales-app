import { View, Text, FlatList, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const categoriasDisponibles = [
  { label: 'Todas las categorías', value: '' },
  { label: 'Comida', value: 'comida' },
  { label: 'Deporte', value: 'deporte' },
  { label: 'Arte', value: 'arte' },
];

type Evento = {
  id: string;
  titulo: string;
  lugar: string;
  descripcion: string;
  tipo: 'gratis' | 'pago';
  precio?: string;
  fecha: string;
  imagen: string;
  categoria: string;
};

export default function IndexScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [mostrarListaCategorias, setMostrarListaCategorias] = useState(false);

  useEffect(() => {
    if (params?.nuevo) {
      try {
        const data = Array.isArray(params.nuevo) ? params.nuevo[0] : params.nuevo;
        const nuevoEvento: Evento = JSON.parse(data);

        setEventos((prev) => {
          const existe = prev.find((e) => e.id === nuevoEvento.id);
          if (!existe) return [nuevoEvento, ...prev];
          return prev;
        });
      } catch (error) {
        console.warn('No se pudo parsear el evento:', error);
      }
    }
  }, [params?.nuevo]);

  const eventosFiltrados = eventos.filter((evento) => {
    const coincideBusqueda =
      evento.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      evento.lugar.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      !categoriaSeleccionada || evento.categoria === categoriaSeleccionada;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Eventos cerca de ti</Text>

      <TextInput
        placeholder="Buscar por título o lugar"
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
        style={styles.input}
      />

      <Pressable
        onPress={() => setMostrarListaCategorias((prev) => !prev)}
        style={styles.categoriaToggle}
      >
        <Text style={styles.categoriaToggleText}>
          {categoriasDisponibles.find((c) => c.value === categoriaSeleccionada)?.label || 'Seleccionar categoría'}
        </Text>
        <MaterialIcons name={mostrarListaCategorias ? 'expand-less' : 'expand-more'} size={20} color="#000" />
      </Pressable>

      {mostrarListaCategorias && (
        <View style={styles.listaCategorias}>
          {categoriasDisponibles.map((cat) => (
            <Pressable
              key={cat.value}
              onPress={() => {
                setCategoriaSeleccionada(cat.value);
                setMostrarListaCategorias(false);
              }}
              style={styles.itemCategoria}
            >
              <Text style={styles.textoCategoria}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <FlatList
        data={eventosFiltrados}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No hay eventos aún</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagen }} style={styles.imagen} />
            <View style={styles.info}>
              <Text style={styles.evento}>{item.titulo}</Text>
              <Text style={styles.lugar}>{item.lugar}</Text>
              <Text>{item.descripcion}</Text>
              <Text style={styles.fecha}>{item.fecha}</Text>
              <View style={styles.etiquetasContainer}>
                <View style={[styles.etiqueta, { backgroundColor: '#757575' }]}> 
                  <Text style={styles.etiquetaTexto}>{item.categoria}</Text>
                </View>
                <View style={[styles.etiqueta, {
                  backgroundColor: item.tipo === 'gratis' ? '#4CAF50' : '#FF5722',
                }]}
                >
                  <Text style={styles.etiquetaTexto}>
                    {item.tipo === 'gratis' ? 'GRATIS' : `PAGO - $${item.precio ?? ''}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoriaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 10,
  },
  categoriaToggleText: {
    fontSize: 16,
    color: '#000',
  },
  listaCategorias: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  itemCategoria: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  textoCategoria: {
    fontSize: 16,
    color: '#000',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#eee',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  imagen: { width: '100%', height: 180 },
  info: { padding: 12 },
  evento: { fontSize: 18, fontWeight: 'bold' },
  lugar: { fontWeight: 'bold', marginTop: 4 },
  fecha: { fontStyle: 'italic', marginTop: 2, marginBottom: 5 },
  etiquetasContainer: { flexDirection: 'row', gap: 8, marginTop: 5 },
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  etiquetaTexto: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});