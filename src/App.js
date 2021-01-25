import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact={true} path="/" component={HomePage} />
        <Route exact={true} path="/api" component={HomePage} />
        <Route exact={true} path="/dashboard" component={DashboardPage} />
      </Switch>
      <h1>pankaj kumar</h1>
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <h2>pankaj jaiswal</h2>
    </div>
  )
}

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  )
}

export default App;
