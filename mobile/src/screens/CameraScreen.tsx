import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { analyzeImageWithGemini } from '../services/geminiService';
import { AnalysisResult } from '../types';
import ResultCard from '../components/ResultCard';

const CameraScreen: React.FC = () => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedImage(photo.uri);
        analyzeImage(photo.uri, photo.base64);
      } catch (error) {
        showToast('error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setCapturedImage(asset.uri);
        analyzeImage(asset.uri, asset.base64);
      }
    } catch (error) {
      showToast('error', 'Failed to pick image');
    }
  };

  const analyzeImage = async (imageUri: string, base64?: string) => {
    setIsAnalyzing(true);
    try {
      const dataUrl = base64 ? `data:image/jpeg;base64,${base64}` : imageUri;
      const result = await analyzeImageWithGemini(dataUrl, imageUri);
      setAnalysisResult(result);
      showToast('success', 'Analysis complete!');
    } catch (error) {
      showToast('error', 'Analysis failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No access to camera</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (analysisResult) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <ResultCard result={analysisResult} />
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.primary }]}
          onPress={resetAnalysis}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.buttonText}>Analyze Another Item</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (capturedImage && isAnalyzing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image source={{ uri: capturedImage }} style={styles.previewImage} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Analyzing with Gemini AI...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.surface }]}
              onPress={() =>
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                )
              }
            >
              <Ionicons name="camera-reverse" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.surface }]}
              onPress={pickImage}
            >
              <Ionicons name="images" size={24} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
  },
  placeholder: {
    width: 50,
    height: 50,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  previewImage: {
    width: '90%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    gap: 8,
  },
});

export default CameraScreen;