
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

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

export default function IndexScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosAgregados, setEventosAgregados] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (params?.nuevo) {
      try {
        const data = Array.isArray(params.nuevo) ? params.nuevo[0] : params.nuevo;
        const nuevoEvento: Evento = JSON.parse(data);

        if (!eventosAgregados.has(nuevoEvento.id)) {
          setEventos((prev) => [nuevoEvento, ...prev]);
          setEventosAgregados((prev) => new Set(prev).add(nuevoEvento.id));
        }
      } catch (error) {
        console.warn('No se pudo parsear el evento:', error);
      }
    }
  }, [params]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Eventos cerca de ti</Text>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No hay eventos aún</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagen }} style={styles.imagen} onError={() => console.log('Error cargando imagen')} />
            <View style={styles.info}>
              <Text style={styles.evento}>{item.titulo}</Text>
              <Text style={styles.lugar}>{item.lugar}</Text>
              <Text>{item.descripcion}</Text>
              <Text style={styles.fecha}>{item.fecha}</Text>
              <View
                style={[
                  styles.etiqueta,
                  {
                    backgroundColor: item.tipo === 'gratis' ? '#4CAF50' : '#FF5722',
                  },
                ]}
              >
                <Text style={styles.etiquetaTexto}>
                  {item.tipo === 'gratis' ? 'GRATIS' : `PAGO - $${item.precio ?? ''}`}
                </Text>
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
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 8,
  },
  etiquetaTexto: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
