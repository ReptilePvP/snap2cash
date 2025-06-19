import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import AdaptiveContainer from '../components/AdaptiveContainer';
import AdaptiveText from '../components/AdaptiveText';
import { wp, hp, spacing, isTablet, adaptiveValue } from '../utils/responsive';

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

  const buttonHeight = adaptiveValue({
    'small-phone': 44,
    phone: 48,
    'large-phone': 52,
    tablet: 56,
  });

  const iconSize = adaptiveValue({
    'small-phone': 20,
    phone: 24,
    'large-phone': 26,
    tablet: 28,
  });

  if (analysisResult) {
    return (
      <AdaptiveContainer maxWidth={isTablet() ? 800 : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ResultCard result={analysisResult} />
          <TouchableOpacity
            style={[
              styles.resetButton, 
              { 
                backgroundColor: colors.primary,
                height: buttonHeight,
                marginHorizontal: spacing.lg,
                marginBottom: spacing.xl,
              }
            ]}
            onPress={resetAnalysis}
          >
            <Ionicons name="refresh" size={iconSize} color="white" />
            <AdaptiveText style={styles.buttonText}>
              Analyze Another Item
            </AdaptiveText>
          </TouchableOpacity>
        </ScrollView>
      </AdaptiveContainer>
    );
  }

  if (isAnalyzing) {
    return (
      <AdaptiveContainer centerContent>
        <ActivityIndicator size="large" color={colors.primary} />
        <AdaptiveText 
          style={[styles.loadingText, { color: colors.text }]}
          adaptiveSize={{
            'small-phone': 14,
            phone: 16,
            tablet: 18,
          }}
        >
          Analyzing with Gemini AI...
        </AdaptiveText>
      </AdaptiveContainer>
    );
  }

  if (showCamera) {
    if (hasPermission === null) {
      return (
        <AdaptiveContainer centerContent>
          <AdaptiveText style={{ color: colors.text }}>
            Requesting camera permission...
          </AdaptiveText>
        </AdaptiveContainer>
      );
    }

    if (hasPermission === false) {
      return (
        <AdaptiveContainer centerContent>
          <AdaptiveText style={{ color: colors.text }}>
            No access to camera
          </AdaptiveText>
          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: colors.primary,
                height: buttonHeight,
                marginTop: spacing.lg,
              }
            ]}
            onPress={() => setShowCamera(false)}
          >
            <AdaptiveText style={styles.buttonText}>Go Back</AdaptiveText>
          </TouchableOpacity>
        </AdaptiveContainer>
      );
    }

    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <View style={[styles.topControls, { paddingTop: spacing.xxl }]}>
              <TouchableOpacity
                style={[
                  styles.controlButton, 
                  { 
                    backgroundColor: colors.surface,
                    width: adaptiveValue({
                      'small-phone': 40,
                      phone: 50,
                      tablet: 60,
                    }),
                    height: adaptiveValue({
                      'small-phone': 40,
                      phone: 50,
                      tablet: 60,
                    }),
                  }
                ]}
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="close" size={iconSize} color={colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.controlButton, 
                  { 
                    backgroundColor: colors.surface,
                    width: adaptiveValue({
                      'small-phone': 40,
                      phone: 50,
                      tablet: 60,
                    }),
                    height: adaptiveValue({
                      'small-phone': 40,
                      phone: 50,
                      tablet: 60,
                    }),
                  }
                ]}
                onPress={() =>
                  setType(
                    type === CameraType.back ? CameraType.front : CameraType.back
                  )
                }
              >
                <Ionicons name="camera-reverse" size={iconSize} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={[styles.bottomControls, { paddingBottom: spacing.xxl }]}>
              <View style={styles.placeholder} />

              <TouchableOpacity 
                style={[
                  styles.captureButton,
                  {
                    width: adaptiveValue({
                      'small-phone': 70,
                      phone: 80,
                      tablet: 90,
                    }),
                    height: adaptiveValue({
                      'small-phone': 70,
                      phone: 80,
                      tablet: 90,
                    }),
                  }
                ]} 
                onPress={takePicture}
              >
                <View style={[
                  styles.captureButtonInner,
                  {
                    width: adaptiveValue({
                      'small-phone': 50,
                      phone: 60,
                      tablet: 70,
                    }),
                    height: adaptiveValue({
                      'small-phone': 50,
                      phone: 60,
                      tablet: 70,
                    }),
                  }
                ]} />
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </View>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <AdaptiveContainer maxWidth={isTablet() ? 600 : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: spacing.xl }]}>
          <Ionicons 
            name="camera" 
            size={adaptiveValue({
              'small-phone': 40,
              phone: 48,
              tablet: 56,
            })} 
            color={colors.primary} 
          />
          <AdaptiveText 
            variant="h2" 
            style={[styles.title, { color: colors.text }]}
            adaptiveSize={{
              'small-phone': 24,
              phone: 28,
              tablet: 32,
            }}
          >
            Item Analysis
          </AdaptiveText>
          <AdaptiveText 
            variant="body" 
            style={[styles.subtitle, { color: colors.textSecondary }]}
            adaptiveSize={{
              'small-phone': 14,
              phone: 16,
              tablet: 18,
            }}
          >
            Take a photo or upload an image to get instant AI-powered value estimation
          </AdaptiveText>
        </View>

        <ImageUpload onImageUploaded={handleImageUploaded} isAnalyzing={isAnalyzing} />

        <View style={styles.orContainer}>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          <AdaptiveText 
            style={[styles.orText, { color: colors.textSecondary }]}
            adaptiveSize={{
              'small-phone': 12,
              phone: 14,
              tablet: 16,
            }}
          >
            OR
          </AdaptiveText>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        </View>

        <TouchableOpacity
          style={[
            styles.cameraButton, 
            { 
              backgroundColor: colors.primary,
              height: buttonHeight,
              marginHorizontal: spacing.lg,
              marginBottom: spacing.xl,
            }
          ]}
          onPress={() => setShowCamera(true)}
        >
          <Ionicons name="camera" size={iconSize} color="white" />
          <AdaptiveText style={styles.buttonText}>Open Camera</AdaptiveText>
        </TouchableOpacity>
      </ScrollView>
    </AdaptiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
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
    paddingHorizontal: spacing.lg,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  controlButton: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    borderRadius: 50,
    backgroundColor: '#3b82f6',
  },
  placeholder: {
    width: 50,
    height: 50,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    marginHorizontal: spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: spacing.lg,
    fontWeight: '500',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: spacing.sm,
  },
  button: {
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: spacing.sm,
  },
});

export default CameraScreen;