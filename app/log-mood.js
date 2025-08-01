import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const MOOD_CATEGORIES = [
  {
    category: 'Positive',
    moods: [
      { emoji: '😊', description: 'Happy', intensity: 1 },
      { emoji: '🤩', description: 'Excited', intensity: 2 },
      { emoji: '😌', description: 'Calm', intensity: 1 },
      { emoji: '😇', description: 'Grateful', intensity: 1 },
    ]
  },
  {
    category: 'Neutral',
    moods: [
      { emoji: '😐', description: 'Neutral', intensity: 0 },
      { emoji: '🤔', description: 'Thoughtful', intensity: 0 },
      { emoji: '😴', description: 'Tired', intensity: 0 },
    ]
  },
  {
    category: 'Challenging',
    moods: [
      { emoji: '😢', description: 'Sad', intensity: -1 },
      { emoji: '😠', description: 'Angry', intensity: -2 },
      { emoji: '😤', description: 'Frustrated', intensity: -1 },
      { emoji: '😰', description: 'Anxious', intensity: -1 },
    ]
  }
];

const LogMoodScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMoodPress = (mood) => {
    setSelectedMood(mood);
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSave = () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood');
      return;
    }
    const newMoodEntry = {
      mood: selectedMood,
      note: note,
      date: new Date().toISOString(),
    };
    router.push({ pathname: '/', params: { newMood: JSON.stringify(newMoodEntry) } });
  };

  const getMoodColor = (intensity) => {
    if (intensity > 0) return '#4CAF50';
    if (intensity < 0) return '#FF5722';
    return '#FFC107';
  };

  const getMoodBackground = (intensity) => {
    if (intensity > 0) return '#E8F5E8';
    if (intensity < 0) return '#FFEBEE';
    return '#FFF8E1';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>Take a moment to check in with yourself</Text>
        </Animated.View>

        {/* Category Tabs */}
        <Animated.View style={[styles.categoryContainer, { opacity: fadeAnim }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MOOD_CATEGORIES.map((category, index) => (
              <Pressable
                key={category.category}
                style={[
                  styles.categoryTab,
                  selectedCategory === index && styles.selectedCategoryTab
                ]}
                onPress={() => setSelectedCategory(index)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === index && styles.selectedCategoryText
                ]}>
                  {category.category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Mood Grid */}
        <Animated.View style={[styles.moodGrid, { opacity: fadeAnim }]}>
          {MOOD_CATEGORIES[selectedCategory].moods.map((mood, index) => (
            <Animated.View
              key={mood.description}
              style={[
                styles.moodCard,
                { backgroundColor: getMoodBackground(mood.intensity) },
                selectedMood?.description === mood.description && styles.selectedMoodCard
              ]}
            >
              <Pressable
                style={styles.moodPressable}
                onPress={() => handleMoodPress(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodDescription,
                  { color: getMoodColor(mood.intensity) }
                ]}>
                  {mood.description}
                </Text>
                {selectedMood?.description === mood.description && (
                  <View style={[styles.checkmark, { backgroundColor: getMoodColor(mood.intensity) }]}>
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  </View>
                )}
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Note Section */}
        <Animated.View style={[styles.noteSection, { opacity: fadeAnim }]}>
          <View style={styles.noteHeader}>
            <Ionicons name="create-outline" size={20} color="#667eea" />
            <Text style={styles.noteTitle}>Add a note (optional)</Text>
          </View>
          <TextInput
            style={styles.noteInput}
            placeholder="What's on your mind? What made you feel this way?"
            placeholderTextColor="#9ca3af"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Animated.View>

        {/* Save Button */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <Pressable
            style={[
              styles.saveButton,
              !selectedMood && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!selectedMood}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={24} 
              color={selectedMood ? "#ffffff" : "#9ca3af"} 
            />
            <Text style={[
              styles.saveButtonText,
              !selectedMood && styles.saveButtonTextDisabled
            ]}>
              Save My Mood
            </Text>
          </Pressable>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[styles.quickActions, { opacity: fadeAnim }]}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Pressable style={styles.actionButton}>
              <Ionicons name="time-outline" size={20} color="#667eea" />
              <Text style={styles.actionText}>Remind Me</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color="#667eea" />
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="analytics-outline" size={20} color="#667eea" />
              <Text style={styles.actionText}>Insights</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 15,
    borderRadius: 25,
    backgroundColor: '#f1f3f4',
  },
  selectedCategoryTab: {
    backgroundColor: '#667eea',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  moodCard: {
    width: (width - 60) / 2,
    height: 120,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedMoodCard: {
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{ scale: 1.05 }],
  },
  moodPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  moodEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  moodDescription: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  noteInput: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#f1f3f4',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveButtonTextDisabled: {
    color: '#9ca3af',
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#667eea',
    marginTop: 5,
  },
});

export default LogMoodScreen;