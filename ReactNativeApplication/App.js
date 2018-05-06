import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation';

import TypeScreen from './screens/TypeScreen';
import CompanyScreen from './screens/CompanyScreen';
import ActionScreen from './screens/ActionScreen';
import CarryOutActionScreen from './screens/CarryOutActionScreen';
import EventScreen from './screens/EventScreen';

console.disableYellowBox = true;

export default StackNavigator(
  {
    ParticipantType: { screen: TypeScreen },
    Participant: { screen: CompanyScreen, navigationOptions: {title: 'Terug naar Bedrijfskeuze'}},
    Action: { screen: ActionScreen, navigationOptions: {title: 'Terug naar bedrijven'}},
    CarryOutAction: { screen: CarryOutActionScreen, navigationOptions: {title: 'Terug naar acties'}},
    Events: { screen: EventScreen, navigationOptions: {title: 'Terug naar actie info'}},
  },
  {
    initialRouteName: 'ParticipantType',
  }
  
)