// In app/(tabs)/index.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import MoodItem from '../../components/MoodItem';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [moodList, setMoodList] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const isFocused = useIsFocused();
  const params = useLocalSearchParams();

  const loadMoods = useCallback(async () => {
    try {
      const storedMoods = await AsyncStorage.getItem('moods');
      if (storedMoods) {
        const moods = JSON.parse(storedMoods);
        setMoodList(moods);
        calculateStats(moods);
      }
    } catch (e) { console.error("Failed to load moods.", e); }
  }, []);

  const calculateStats = (moods) => {
    // Calculate current streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasMood = moods.some(mood => {
        const moodDate = new Date(mood.date);
        return moodDate.toDateString() === checkDate.toDateString();
      });
      if (hasMood) streak++;
      else break;
    }
    setCurrentStreak(streak);

    // Calculate weekly average
    const lastWeek = moods.filter(mood => {
      const moodDate = new Date(mood.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return moodDate >= weekAgo;
    });
    setWeeklyAverage(lastWeek.length);
  };

  useEffect(() => {
    if (isFocused) { 
      loadMoods();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, loadMoods]);

  useEffect(() => {
    if (params.newMood) {
      const newEntry = JSON.parse(params.newMood);
      const updatedList = [newEntry, ...moodList];
      updatedList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMoodList(updatedList);
      AsyncStorage.setItem('moods', JSON.stringify(updatedList));
      calculateStats(updatedList);
    }
  }, [params.newMood]);

  const getCurrentMood = () => {
    const today = new Date();
    return moodList.find(mood => {
      const moodDate = new Date(mood.date);
      return moodDate.toDateString() === today.toDateString();
    });
  };

  const currentMood = getCurrentMood();

  const getMoodColor = (moodDescription) => {
    const colors = {
      'Happy': '#FFD700',
      'Excited': '#FF6B6B',
      'Neutral': '#4ECDC4',
      'Sad': '#45B7D1',
      'Angry': '#FF8A80',
      'Tired': '#9C27B0',
      'Calm': '#4CAF50',
      'Frustrated': '#FF9800'
    };
    return colors[moodDescription] || '#667eea';
  };

  const getMoodEmoji = (moodDescription) => {
    const emojis = {
      'Happy': '😊',
      'Excited': '🤩',
      'Neutral': '😐',
      'Sad': '😢',
      'Angry': '😠',
      'Tired': '😴',
      'Calm': '😌',
      'Frustrated': '😤'
    };
    return emojis[moodDescription] || '😊';
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello there! 👋</Text>
        <Text style={styles.subtitle}>How's your emotional journey today?</Text>
      </View>

      {/* Stats Cards */}
      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#FF6B6B" />
          <Text style={styles.statNumber}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color="#4ECDC4" />
          <Text style={styles.statNumber}>{weeklyAverage}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="heart" size={24} color="#FF8A80" />
          <Text style={styles.statNumber}>{moodList.length}</Text>
          <Text style={styles.statLabel}>Total Entries</Text>
        </View>
      </Animated.View>

      {/* Current Mood Section */}
      {currentMood ? (
        <Animated.View style={[styles.currentMoodSection, { opacity: fadeAnim }]}>
          <View style={[styles.currentMoodCard, { backgroundColor: getMoodColor(currentMood.mood.description) }]}>
            <View style={styles.currentMoodHeader}>
              <Text style={styles.currentMoodEmoji}>{getMoodEmoji(currentMood.mood.description)}</Text>
              <View style={styles.currentMoodInfo}>
                <Text style={styles.currentMoodText}>Today's Mood</Text>
                <Text style={styles.currentMoodDescription}>{currentMood.mood.description}</Text>
              </View>
            </View>
            {currentMood.note && (
              <Text style={styles.currentMoodNote}>"{currentMood.note}"</Text>
            )}
          </View>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.noMoodSection, { opacity: fadeAnim }]}>
          <View style={styles.noMoodCard}>
            <Ionicons name="add-circle-outline" size={48} color="#667eea" />
            <Text style={styles.noMoodTitle}>No mood logged today</Text>
            <Text style={styles.noMoodSubtitle}>Take a moment to reflect on your feelings</Text>
            <Link href="/log-mood" asChild>
              <Pressable style={styles.logMoodButton}>
                <Text style={styles.logMoodButtonText}>Log My Mood</Text>
              </Pressable>
            </Link>
          </View>
        </Animated.View>
      )}

      {/* Recent Entries */}
      <Animated.View style={[styles.recentSection, { opacity: fadeAnim }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          <Text style={styles.sectionSubtitle}>Your emotional timeline</Text>
        </View>
        <FlatList
          data={moodList.slice(0, 5)}
          renderItem={({ item }) => <MoodItem item={item} />}
          keyExtractor={(item) => item.date}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
        {moodList.length > 5 && (
          <Pressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Entries</Text>
            <Ionicons name="arrow-forward" size={16} color="#667eea" />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  currentMoodSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  currentMoodCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentMoodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentMoodEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  currentMoodInfo: {
    flex: 1,
  },
  currentMoodText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  currentMoodDescription: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  currentMoodNote: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  noMoodSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  noMoodCard: {
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noMoodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 8,
  },
  noMoodSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  logMoodButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  logMoodButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 10,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginRight: 8,
  },
});

export default HomeScreen;