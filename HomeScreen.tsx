import React, { Component } from 'react';
import { Alert, Modal, StyleSheet, Text, Animated, Easing, View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButton from 'react-native-action-button';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Completed from './body/Completed';
import NotCompletePassed from './body/NotCompletePassed';
import NotCompletedFuture from './body/NotCompletedFuture';
import NotCompleteCurrent from './body/NotCompleteCurrent';

interface Item {
    start: string;
    end: string;
    name: string;
    description: string;
    height: number;
    completed: boolean;
    date: string;
    day: string;
    key: string;
  }
  
  interface State {
    today: Date;
    loading: boolean;
    items: Record<string, Item[]>;
    loadedKeys: string[];
  }

  