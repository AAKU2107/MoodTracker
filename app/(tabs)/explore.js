import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const StatsScreen = () => {
  const [moodData, setMoodData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  useFocusEffect(useCallback(() => {
    loadMoodData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []));

  const loadMoodData = async () => {
    try {
      const storedMoods = await AsyncStorage.getItem('moods');
      if (storedMoods) {
        const moods = JSON.parse(storedMoods);
        setMoodData(moods);
      }
    } catch (error) {
      console.error('Failed to load mood data:', error);
    }
  };

  const getMoodStats = () => {
    const totalMoods = moodData.length;
    const moodCounts = {};
    const weeklyMoods = moodData.filter(mood => {
      const moodDate = new Date(mood.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return moodDate >= weekAgo;
    });

    moodData.forEach(mood => {
      const description = mood.mood.description;
      moodCounts[description] = (moodCounts[description] || 0) + 1;
    });

    return { totalMoods, moodCounts, weeklyMoods };
  };

  const getMoodColor = (moodDescription) => {
    const colors = {
      'Happy': '#4CAF50',
      'Excited': '#FF6B6B',
      'Neutral': '#FFC107',
      'Sad': '#2196F3',
      'Angry': '#FF5722',
      'Tired': '#9C27B0',
      'Calm': '#4CAF50',
      'Frustrated': '#FF9800',
      'Grateful': '#4CAF50',
      'Thoughtful': '#FFC107',
      'Anxious': '#FF5722'
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
      'Frustrated': '😤',
      'Grateful': '😇',
      'Thoughtful': '🤔',
      'Anxious': '😰'
    };
    return emojis[moodDescription] || '😊';
  };

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasMood = moodData.some(mood => {
        const moodDate = new Date(mood.date);
        return moodDate.toDateString() === checkDate.toDateString();
      });
      if (hasMood) streak++;
      else break;
    }
    return streak;
  };

  const getAverageMood = () => {
    if (moodData.length === 0) return 'No data';
    const moodValues = {
      'Happy': 5, 'Excited': 5, 'Grateful': 4, 'Calm': 4,
      'Neutral': 3, 'Thoughtful': 3, 'Tired': 2,
      'Sad': 2, 'Frustrated': 1, 'Anxious': 1, 'Angry': 1
    };
    
    const totalValue = moodData.reduce((sum, mood) => {
      return sum + (moodValues[mood.mood.description] || 3);
    }, 0);
    
    const average = totalValue / moodData.length;
    if (average >= 4) return 'Positive';
    if (average >= 2.5) return 'Neutral';
    return 'Challenging';
  };

  const { totalMoods, moodCounts, weeklyMoods } = getMoodStats();
  const currentStreak = calculateStreak();
  const averageMood = getAverageMood();

  const periods = [
    { key: 'week', label: 'Week', icon: 'calendar-outline' },
    { key: 'month', label: 'Month', icon: 'calendar' },
    { key: 'year', label: 'Year', icon: 'calendar-sharp' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Your Mood Insights</Text>
          <Text style={styles.headerSubtitle}>Understanding your emotional patterns</Text>
        </Animated.View>

        {/* Period Selector */}
        <Animated.View style={[styles.periodSelector, { opacity: fadeAnim }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {periods.map((period) => (
              <Pressable
                key={period.key}
                style={[
                  styles.periodTab,
                  selectedPeriod === period.key && styles.selectedPeriodTab
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Ionicons 
                  name={period.icon} 
                  size={20} 
                  color={selectedPeriod === period.key ? '#ffffff' : '#667eea'} 
                />
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period.key && styles.selectedPeriodText
                ]}>
                  {period.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Key Metrics */}
        <Animated.View style={[styles.metricsContainer, { opacity: fadeAnim }]}>
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.metricValue}>{currentStreak}</Text>
            <Text style={styles.metricLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="heart" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.metricValue}>{totalMoods}</Text>
            <Text style={styles.metricLabel}>Total Entries</Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="trending-up" size={24} color="#FFC107" />
            </View>
            <Text style={styles.metricValue}>{averageMood}</Text>
            <Text style={styles.metricLabel}>Avg Mood</Text>
          </View>
        </Animated.View>

        {/* Mood Distribution */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pie-chart-outline" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Mood Distribution</Text>
          </View>
          
          {Object.keys(moodCounts).length > 0 ? (
            <View style={styles.moodDistribution}>
              {Object.entries(moodCounts)
                .sort(([,a], [,b]) => b - a)
                .map(([mood, count]) => {
                  const percentage = Math.round((count / totalMoods) * 100);
                  return (
                    <View key={mood} style={styles.moodBar}>
                      <View style={styles.moodBarHeader}>
                        <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                        <Text style={styles.moodName}>{mood}</Text>
                        <Text style={styles.moodCount}>{count}</Text>
                      </View>
                      <View style={styles.progressContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { 
                              width: `${percentage}%`,
                              backgroundColor: getMoodColor(mood)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.percentageText}>{percentage}%</Text>
                    </View>
                  );
                })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="analytics-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No Data Yet</Text>
              <Text style={styles.emptyText}>Start logging your moods to see insights</Text>
            </View>
          )}
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          
          {weeklyMoods.length > 0 ? (
            <View style={styles.recentActivity}>
              {weeklyMoods.slice(0, 5).map((mood, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityEmoji}>
                    <Text style={styles.activityEmojiText}>{getMoodEmoji(mood.mood.description)}</Text>
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityMood}>{mood.mood.description}</Text>
                    <Text style={styles.activityDate}>
                      {new Date(mood.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Text>
                  </View>
                  {mood.note && (
                    <Text style={styles.activityNote} numberOfLines={1}>
                      "{mood.note}"
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No Recent Activity</Text>
              <Text style={styles.emptyText}>Log your first mood to see activity</Text>
            </View>
          )}
        </Animated.View>

        {/* Insights */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Insights</Text>
          </View>
          
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
              <Text style={styles.insightText}>
                {currentStreak > 0 ? `You've been consistent for ${currentStreak} days!` : 'Start your mood tracking journey today!'}
              </Text>
            </View>
            
            {Object.keys(moodCounts).length > 0 && (
              <View style={styles.insightCard}>
                <Ionicons name="heart" size={20} color="#FF6B6B" />
                <Text style={styles.insightText}>
                  Your most frequent mood is {Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0][0]}
                </Text>
              </View>
            )}
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
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  periodSelector: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
  },
  periodTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
  },
  selectedPeriodTab: {
    backgroundColor: '#667eea',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 6,
  },
  selectedPeriodText: {
    color: '#ffffff',
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  moodDistribution: {
    marginBottom: 10,
  },
  moodBar: {
    marginBottom: 15,
  },
  moodBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  moodCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#f1f3f4',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  recentActivity: {
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  activityEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmojiText: {
    fontSize: 18,
  },
  activityInfo: {
    flex: 1,
  },
  activityMood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  activityDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  activityNote: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    maxWidth: 100,
  },
  insightsContainer: {
    marginBottom: 10,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default StatsScreen;