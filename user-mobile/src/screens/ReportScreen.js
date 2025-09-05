import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { API_BASE } from '../config/api';

export default function ReportScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hazardType, setHazardType] = useState('other');
  const [severity, setSeverity] = useState('unknown');
  const [contact, setContact] = useState('');

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } else {
        Alert.alert('Location required', 'Please enable location to include geotag in report.');
      }
    })();
  }, [permission, requestPermission]);

  const takePhoto = async () => {
    try {
      if (!isCameraReady || !cameraRef.current) return;
      const data = await cameraRef.current.takePictureAsync();
      const uri = data?.uri;
      if (uri) setPhotos((prev) => [...prev, uri]);
      if (cameraRef.current?.resumePreview) {
        try { await cameraRef.current.resumePreview(); } catch {}
      }
    } catch (e) {
      console.warn('takePhoto error', e);
    }
  };

  const removePhoto = (uri) => setPhotos((prev) => prev.filter((u) => u !== uri));
  const clearPhotos = () => setPhotos([]);

  const submit = async () => {
    if (!photos.length) return Alert.alert('Add photos', 'Please take at least one photo.');
    if (!location) return Alert.alert('Enable location', 'Location is required to submit.');
    setSubmitting(true);
    try {
      const fd = new FormData();
      photos.forEach((uri, index) => fd.append('images', { uri, name: `photo_${index + 1}.jpg`, type: 'image/jpeg' }));
      fd.append('description', description);
      fd.append('latitude', String(location.latitude));
      fd.append('longitude', String(location.longitude));
      fd.append('type', hazardType);
      fd.append('severity', severity);
      fd.append('contact', contact);

      const res = await fetch(`${API_BASE}/api/reports`, { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Upload failed');
      Alert.alert('Success', 'Report submitted successfully.');
      setPhotos([]);
      setDescription('');
      setHazardType('other');
      setSeverity('unknown');
      setContact('');
      if (cameraRef.current?.resumePreview) { try { await cameraRef.current.resumePreview(); } catch {} }
      if (navigation?.goBack) navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (!permission) return <View style={styles.center}><Text style={styles.blackText}>Requesting camera permission...</Text></View>;
  if (!permission.granted) return <View style={styles.center}><Text style={styles.blackText}>No access to camera</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Hazard</Text>
      <CameraView style={styles.camera} ref={(ref) => (cameraRef.current = ref)} facing="back" onCameraReady={() => setIsCameraReady(true)} />
      {photos.length > 0 && (
        <ScrollView horizontal style={styles.previewRow} showsHorizontalScrollIndicator={false}>
          {photos.map((u) => (
            <View key={u} style={styles.previewItem}>
              <Image source={{ uri: u }} style={styles.preview} />
              <TouchableOpacity style={styles.removeChip} onPress={() => removePhoto(u)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <Text style={styles.label}>Hazard Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeRow}>
        {['tsunami','storm_surge','high_waves','swell_surge','coastal_flooding','abnormal_sea','pollution','other'].map((t)=>(
          <TouchableOpacity key={t} style={[styles.chip, hazardType===t && styles.chipActive]} onPress={()=>setHazardType(t)}>
            <Text style={[styles.chipText, hazardType===t && styles.chipTextActive]}>{t.replace('_',' ')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput placeholder="Severity (e.g., low/medium/high)" placeholderTextColor="#607D8B" value={severity} onChangeText={setSeverity} style={styles.input} />
      <TextInput placeholder="Your contact (optional)" placeholderTextColor="#607D8B" value={contact} onChangeText={setContact} style={styles.input} />
      <TextInput placeholder="Add description" placeholderTextColor="#607D8B" value={description} onChangeText={setDescription} style={styles.input} />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={takePhoto} disabled={!isCameraReady || submitting}><Text style={styles.buttonText}>📸 Take Photo</Text></TouchableOpacity>
        {photos.length > 0 && (<TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearPhotos} disabled={submitting}><Text style={styles.buttonText}>🗑️ Clear</Text></TouchableOpacity>)}
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={submit} disabled={submitting}>{submitting ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>✅ Submit</Text>}</TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  blackText: { color: '#000000' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000000', margin: 16 },
  camera: { height: 280, borderRadius: 12, marginHorizontal: 16, overflow: 'hidden' },
  label: { marginHorizontal: 16, marginTop: 10, color: '#000000', fontWeight: '600' },
  typeRow: { marginHorizontal: 16, marginTop: 6 },
  chip: { backgroundColor: '#E3F2FD', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 16, marginRight: 8 },
  chipActive: { backgroundColor: '#1565C0' },
  chipText: { color: '#0D47A1' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  previewRow: { maxHeight: 140, backgroundColor: '#E3F2FD', marginTop: 8 },
  previewItem: { margin: 8, alignItems: 'center' },
  preview: { width: 120, height: 120, borderRadius: 8 },
  removeChip: { marginTop: 6, backgroundColor: '#90CAF9', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  removeText: { color: '#0D47A1', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#90CAF9', backgroundColor: '#FFFFFF', color: '#000000', marginHorizontal: 16, marginTop: 8, padding: 10, borderRadius: 10 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 16 },
  button: { backgroundColor: '#1E88E5', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  clearButton: { backgroundColor: '#90CAF9' },
  submitButton: { backgroundColor: '#1565C0' },
  buttonText: { color: '#000000', fontSize: 16, fontWeight: '600' },
});


