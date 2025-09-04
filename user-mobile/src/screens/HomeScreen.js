import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';
import { API_BASE } from '../config/api';

export default function HomeScreen({ navigation }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/reports`).then(r => r.json()).then(setReports).catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hazard Reports</Text>
      <Button title="Report Hazard" color="#1E88E5" onPress={() => navigation.navigate('Report')} />
      <FlatList
        data={reports}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {(item.imageUrls || []).slice(0, 1).map((u) => (
              <Image key={u} source={{ uri: `${API_BASE}${u}` }} style={styles.image} />
            ))}
            {!!item.description && <Text style={styles.text}>{item.description}</Text>}
            {item.latitude != null && item.longitude != null && (
              <Text style={styles.text}>📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000000', marginBottom: 10 },
  card: { backgroundColor: '#FFFFFF', marginVertical: 8, padding: 10, borderRadius: 10, elevation: 2 },
  image: { width: '100%', height: 160, borderRadius: 8 },
  text: { marginTop: 8, fontSize: 14, color: '#000000' },
});


