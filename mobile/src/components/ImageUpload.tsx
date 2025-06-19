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

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          {!isDisabled && (
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: colors.error }]}
              onPress={clearImage}
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={[styles.uploadArea, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons name="cloud-upload-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.uploadText, { color: colors.text }]}>
            Select an image to analyze
          </Text>
          <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
            Take a photo or choose from gallery
          </Text>
        </View>
      )}

      {isUploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Uploading...</Text>
        </View>
      )}

      {!selectedImage && !isDisabled && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton, { backgroundColor: colors.primary }]}
            onPress={() => pickImage(true)}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.galleryButton, { borderColor: colors.primary }]}
            onPress={() => pickImage(false)}
          >
            <Ionicons name="images" size={20} color={colors.primary} />
            <Text style={[styles.buttonText, { color: colors.primary }]}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  uploadArea: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  cameraButton: {
    // backgroundColor set via props
  },
  galleryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ImageUpload;