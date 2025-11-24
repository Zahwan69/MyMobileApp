import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TimerScreen() {

  const [time, setTime] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const formatTime = (ms: number) => {

    const milliseconds = Math.floor(ms / 10) % 100;
    const totalSeconds = Math.floor(ms /1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };
    useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10); 
      }, 10);
    } else if (!isRunning && intervalRef.current !== null) { 
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false); 
    setTime(0); 
  };


  return (
        // Note: Using View and applying padding fix from earlier
        <View style={styles.container}>
            <Text style={styles.header}>High Precision Stopwatch</Text>
            
            <View style={styles.timeDisplayContainer}>
                <Ionicons name="stopwatch-outline" size={80} color="#c51919ff" />
                <Text style={styles.timeText}>{formatTime(time)}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                {/* NOTE: Swapping Button for TouchableOpacity is highly recommended for styling */}
                <TouchableOpacity
                    style={[styles.customButton, styles.resetButton]}
                    onPress={handleReset}
                    disabled={time === 0 && !isRunning}
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                        styles.customButton,
                        { backgroundColor: isRunning ? '#FF3B30' : '#12db19ff' }
                    ]}
                    onPress={handleStartStop}
                >
                    <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50, // Use useSafeAreaInsets here for best practice
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 50,
        color: '#333',
    },
    timeDisplayContainer: {
        alignItems: 'center',
        marginBottom: 80,
    },
    timeText: {
        fontSize: 56, // Slightly smaller font to fit the milliseconds
        fontWeight: '300',
        color: '#333',
        marginTop: 10,
        fontFamily: 'monospace', // Use monospace font for better alignment
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-around',
    },
    // --- Styles for TouchableOpacity (UI/UX Improvement) ---
    customButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resetButton: {
        backgroundColor: '#0759c4ff',
    },
    buttonText: {
        color: '#FFFFFF', 
        fontSize: 18,
        fontWeight: '600',
    },
});
