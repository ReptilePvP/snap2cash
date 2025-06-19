import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { analyzeImageWithGemini } from '../services/geminiService';
import { uploadImageToBackend } from '../services/apiService';
import { AnalysisResult } from '../types';
import ResultCard from '../components/ResultCard';
import ImageUpload from '../components/ImageUpload';

const CameraScreen: React.FC = () => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
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
        });
        setShowCamera(false);
        
        // Upload to backend first
        const uploadedUrl = await uploadImageToBackend(photo.uri);
        
        // Then analyze
        analyzeImage(photo.uri, uploadedUrl);
      } catch (error) {
        showToast('error', 'Failed to take picture');
      }
    }
  };

  const handleImageUploaded = (uploadedUrl: string, localUri: string) => {
    analyzeImage(localUri, uploadedUrl);
  };

  const analyzeImage = async (localUri: string, uploadedUrl: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImageWithGemini(localUri, uploadedUrl);
      setAnalysisResult(result);
      showToast('success', 'Analysis complete!');
    } catch (error) {
      showToast('error', 'Analysis failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setShowCamera(false);
  };

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

  if (isAnalyzing) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Analyzing with Gemini AI...
        </Text>
      </View>
    );
  }

  if (showCamera) {
    if (hasPermission === null) {
      return (
        <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>Requesting camera permission...</Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>No access to camera</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => setShowCamera(false)}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
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
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              
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
              <View style={styles.placeholder} />

              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </View>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Ionicons name="camera" size={48} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Item Analysis</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Take a photo or upload an image to get instant AI-powered value estimation
        </Text>
      </View>

      <ImageUpload onImageUploaded={handleImageUploaded} isAnalyzing={isAnalyzing} />

      <View style={styles.orContainer}>
        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.orText, { color: colors.textSecondary }]}>OR</Text>
        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity
        style={[styles.cameraButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowCamera(true)}
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
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
    justifyContent: 'space-between',
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
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    marginHorizontal: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
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