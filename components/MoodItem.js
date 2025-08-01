import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const MoodItem = ({ item }) => {
  const date = new Date(item.date);
  
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

  const isToday = () => {
    const today = new Date();
    const moodDate = new Date(item.date);
    return today.toDateString() === moodDate.toDateString();
  };

  const isYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const moodDate = new Date(item.date);
    return yesterday.toDateString() === moodDate.toDateString();
  };

  const getRelativeDate = () => {
    if (isToday()) return 'Today';
    if (isYesterday()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const moodColor = getMoodColor(item.mood.description);
  const moodEmoji = getMoodEmoji(item.mood.description);

  return (
    <Pressable style={styles.container}>
      <View style={styles.card}>
        <View style={styles.moodHeader}>
          <View style={[styles.emojiContainer, { backgroundColor: `${moodColor}20` }]}>
            <Text style={styles.emoji}>{moodEmoji}</Text>
          </View>
          <View style={styles.moodInfo}>
            <Text style={styles.moodDescription}>{item.mood.description}</Text>
            <View style={styles.dateContainer}>
              <Ionicons name="time-outline" size={12} color="#9ca3af" />
              <Text style={styles.date}>
                {getRelativeDate()} at {date.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
          {isToday() && (
            <View style={[styles.todayBadge, { backgroundColor: moodColor }]}>
              <Text style={styles.todayText}>Today</Text>
            </View>
          )}
        </View>
        
        {item.note && (
          <View style={styles.noteContainer}>
            <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
            <Text style={styles.note} numberOfLines={2}>
              {item.note}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  moodInfo: {
    flex: 1,
  },
  moodDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  note: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginLeft: 6,
    lineHeight: 18,
  },
});

export default MoodItem;