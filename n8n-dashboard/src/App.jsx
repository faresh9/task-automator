import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import WorkflowPage from './pages/WorkflowPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Sidebar />
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/workflow/:id" component={WorkflowPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/settings" component={SettingsPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;