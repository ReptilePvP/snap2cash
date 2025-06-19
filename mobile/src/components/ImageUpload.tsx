import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { uploadImageToBackend } from '../services/apiService';
import AdaptiveText from './AdaptiveText';
import { wp, hp, spacing, isTablet, adaptiveValue } from '../utils/responsive';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string, localUri: string) => void;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, isAnalyzing }) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async (useCamera: boolean = false) => {
    try {
      let result;
      
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos.');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library permission is required to select images.');
          return;
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        await uploadImage(imageUri);
      }
    } catch (error) {
      showToast('error', 'Failed to select image');
      console.error('Image picker error:', error);
    }
  };

  const uploadImage = async (imageUri: string) => {
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImageToBackend(imageUri);
      onImageUploaded(uploadedUrl, imageUri);
      showToast('success', 'Image uploaded successfully!');
    } catch (error) {
      showToast('error', 'Upload failed', error instanceof Error ? error.message : 'Unknown error');
      setSelectedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  const isDisabled = isAnalyzing || isUploading;

  const uploadAreaHeight = adaptiveValue({
    'small-phone': hp(20),
    phone: hp(25),
    'large-phone': hp(22),
    tablet: hp(30),
  });

  const imageSize = adaptiveValue({
    'small-phone': { width: wp(80), height: hp(20) },
    phone: { width: wp(85), height: hp(25) },
    'large-phone': { width: wp(80), height: hp(22) },
    tablet: { width: wp(70), height: hp(30) },
  });

  const buttonHeight = adaptiveValue({
    'small-phone': 44,
    phone: 48,
    'large-phone': 52,
    tablet: 56,
  });

  const iconSize = adaptiveValue({
    'small-phone': 40,
    phone: 48,
    tablet: 56,
  });

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.lg }]}>
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: selectedImage }} 
            style={[
              styles.previewImage,
              {
                width: imageSize.width,
                height: imageSize.height,
              }
            ]} 
          />
          {!isDisabled && (
            <TouchableOpacity
              style={[
                styles.removeButton, 
                { 
                  backgroundColor: colors.error,
                  width: adaptiveValue({
                    'small-phone': 28,
                    phone: 32,
                    tablet: 36,
                  }),
                  height: adaptiveValue({
                    'small-phone': 28,
                    phone: 32,
                    tablet: 36,
                  }),
                }
              ]}
              onPress={clearImage}
            >
              <Ionicons 
                name="close" 
                size={adaptiveValue({
                  'small-phone': 16,
                  phone: 20,
                  tablet: 24,
                })} 
                color="white" 
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={[
          styles.uploadArea, 
          { 
            borderColor: colors.border, 
            backgroundColor: colors.surface,
            height: uploadAreaHeight,
          }
        ]}>
          <Ionicons 
            name="cloud-upload-outline" 
            size={iconSize} 
            color={colors.textSecondary} 
          />
          <AdaptiveText 
            style={[styles.uploadText, { color: colors.text }]}
            adaptiveSize={{
              'small-phone': 16,
              phone: 18,
              tablet: 20,
            }}
          >
            Select an image to analyze
          </AdaptiveText>
          <AdaptiveText 
            style={[styles.uploadSubtext, { color: colors.textSecondary }]}
            adaptiveSize={{
              'small-phone': 12,
              phone: 14,
              tablet: 16,
            }}
          >
            Take a photo or choose from gallery
          </AdaptiveText>
        </View>
      )}

      {isUploading && (
        <View style={[styles.loadingContainer, { marginVertical: spacing.lg }]}>
          <ActivityIndicator size="small" color={colors.primary} />
          <AdaptiveText 
            style={[styles.loadingText, { color: colors.text }]}
            adaptiveSize={{
              'small-phone': 14,
              phone: 16,
              tablet: 18,
            }}
          >
            Uploading...
          </AdaptiveText>
        </View>
      )}

      {!selectedImage && !isDisabled && (
        <View style={[styles.buttonContainer, { marginTop: spacing.lg }]}>
          <TouchableOpacity
            style={[
              styles.button, 
              styles.cameraButton, 
              { 
                backgroundColor: colors.primary,
                height: buttonHeight,
              }
            ]}
            onPress={() => pickImage(true)}
          >
            <Ionicons 
              name="camera" 
              size={adaptiveValue({
                'small-phone': 18,
                phone: 20,
                tablet: 24,
              })} 
              color="white" 
            />
            <AdaptiveText 
              style={styles.buttonText}
              adaptiveSize={{
                'small-phone': 14,
                phone: 16,
                tablet: 18,
              }}
            >
              Take Photo
            </AdaptiveText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.button, 
              styles.galleryButton, 
              { 
                borderColor: colors.primary,
                height: buttonHeight,
              }
            ]}
            onPress={() => pickImage(false)}
          >
            <Ionicons 
              name="images" 
              size={adaptiveValue({
                'small-phone': 18,
                phone: 20,
                tablet: 24,
              })} 
              color={colors.primary} 
            />
            <AdaptiveText 
              style={[styles.buttonText, { color: colors.primary }]}
              adaptiveSize={{
                'small-phone': 14,
                phone: 16,
                tablet: 18,
              }}
            >
              Choose from Gallery
            </AdaptiveText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  uploadArea: {
    width: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  uploadSubtext: {
    // fontSize set via adaptiveSize
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  previewImage: {
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    // fontSize set via adaptiveSize
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    gap: spacing.sm,
  },
  cameraButton: {
    // backgroundColor set via props
  },
  galleryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
});

export default ImageUpload;