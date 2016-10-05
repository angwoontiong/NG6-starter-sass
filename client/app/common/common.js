import angular from 'angular';
import Navbar from './navbar/navbar';
import Navigation from './navigation/navigation';
import Hero from './hero/hero';
import User from './user/user';

let commonModule = angular.module('app.common', [
  Navbar.name,
  Navigation.name,
  Hero.name,
  User.name
]);

export default commonModule;
