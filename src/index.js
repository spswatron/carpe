import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import ToDo from './Elapsify'
import HomeworkTracker from "./HomeworkTracker";
import MessageCenter from "./MessageCenter";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function Final() {
    return(
        <div className={"page"}>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
            </style>
            <Tabs>
            <TabList>
              <h3 className={"home"}>Carpe</h3>
              <Tab>Elapsify</Tab>
              <Tab style={{whiteSpace: 'nowrap'}}>Homework Tracker</Tab>
                <Tab style={{whiteSpace: 'nowrap'}}>Message Center</Tab>
            </TabList>

            <TabPanel>
              <ToDo />
            </TabPanel>
            <TabPanel>
              <HomeworkTracker />
            </TabPanel>
            <TabPanel>
              <MessageCenter />
            </TabPanel>
          </Tabs>
        </div>
    );
}


ReactDOM.render(
  <Final />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
