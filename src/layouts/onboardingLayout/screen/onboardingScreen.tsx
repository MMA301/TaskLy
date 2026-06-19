import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export function OnboardingScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button at the top right */}
      <TouchableOpacity 
        onPress={handleNext}
        style={styles.skipButton}
      >
        <Text style={styles.skipText}>Bỏ qua</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Onboarding Illustration */}
        <View style={styles.imageWrapper}>
          <Image 
            source={require('../../../../assets/images/onboarding_illustration.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Cơ hội thu nhập linh hoạt</Text>
          <Text style={styles.description}>
            Tận dụng thời gian rảnh rỗi tăng thu nhập với các công việc hợp lịch trình.
          </Text>
        </View>

        {/* Pagination Indicators */}
        <View style={styles.indicatorContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Action Button at the bottom */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity 
          onPress={handleNext}
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>Bắt đầu ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
  },
  skipButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
    marginRight: 20,
  },
  skipText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageWrapper: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#4F46E5', // Matches the active indicator
  },
  buttonWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  actionButton: {
    backgroundColor: '#4F46E5', // Sleek purple/blue button
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});