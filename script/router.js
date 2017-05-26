const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDom = require('react-router-dom');
const { Component } = React;
const { HashRouter, Route } = ReactRouterDom;
require('../style/index.sass');
const Index = require('./Index');
const RecordList = require('./RecordList');


ReactDOM.render(

  <HashRouter>
    <div className="index-app">
      <Route path="/" component={ Index } />
      <Route path="/recordList" component={ RecordList } />
    </div>
  </HashRouter>

  , document.getElementById('ReactBody')
);