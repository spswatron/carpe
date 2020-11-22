import React from 'react';
import './App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import ls from 'local-storage';
import { Helmet } from 'react-helmet'
import { RRule, RRuleSet, rrulestr } from 'rrule'


class Title extends React.PureComponent {
  render () {
    return (
      <>
        <Helmet>
          <title>Homework Tracker</title>
        </Helmet>
      </>
    )
  }
}

class Input extends React.Component {
  render() {
    return(
      <div className="homework-input row">
      <input type="text"
             className={"to-do col"}
               placeholder="Todo..."
               aria-label="Todo"
               aria-describedby="basic-addon2"
               value={this.props.typed}
               onChange={this.props.changes}
               onKeyPress={this.props.enterCheck}
      />
              <DateFind
                  ogDate = {this.props.ogDate}
                  date = {this.props.date}
                  dateChange = {this.props.dateChange}
              />
      <div className={"show"} style={{display: 'flex', alignItems:'center', height: '30px'}}>
                <input style={{marginLeft: '7px'}}
                    className="col form-check-input"
                       type="checkbox"
                       value={this.props.weekly}
                       onChange={() => this.props.weeklyChange()}
                       id="defaultCheck1"/>
                    <label style={{marginLeft: '3px'}} className="col weekly" htmlFor="defaultCheck1">
                       Weekly
                    </label>

      </div>
      </div>
    );
  }
}

function WeekCheck() {
    return(
        <div className="input-group-text" style={{display: 'inline-block'}}>
              <input type="checkbox" aria-label="Checkbox for following text input"/>
              <label>weekly</label>
        </div>
    );
}

class ShowList extends React.Component {
    render() {
        return (
            <div className="dropdown" style = {{display: 'inline-block'}}>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <CheckValue
                        checked={this.props.checked}
                        checkChange={this.props.checkChange}
                        task = {"show todo list"}
                    />
                </div>
            </div>
        );
    }
}

class CheckValue extends React.Component {
    render(){
        return(
            <div className="form-check" style={{display: 'flex', alignItems: 'center', height: 30, marginTop:'20px'}}>
                <input className="form-check-input"
                       type="checkbox" value={this.props.checked}
                       onChange={() => this.props.checkChange()}
                       id="defaultCheck1"/>
                    <label className="form-check-label" htmlFor="defaultCheck1" style ={{display: 'inline-block'}}>
                        {this.props.task}
                    </label>
            </div>
        );
    }
}

class SortBy extends React.Component {
    render(){
        return(
            <select value ="sort by" onChange={this.props.sorter}
            style = {{display: 'inline-block'}}>
              <option value={this.props.chosen} disabled selected>{this.props.chosen}</option>
              <option value="sort by" disabled selected>sort by</option>
              <option value={this.props.options[0]}>{this.props.options[0]}</option>
              <option value={this.props.options[1]}>{this.props.options[1]}</option>
              <option value={this.props.options[2]}>{this.props.options[2]}</option>
            </select>
        )
    }
}

class DateFind extends React.Component {
    render(){
        if(this.props.ogDate.valueOf() === this.props.date.valueOf()) {
            return (
                <DatePicker
                    placeholderText="due date"
                    className="due-date"
                    type="button"
                    data-toggle="dropdown"
                    onChange={this.props.dateChange}
                    dateFormat='Pp'
                    showTimeSelect
                    filterDate={x => x > new Date()}
                />
            )
        }
        else {
            return (
                <DatePicker
                    className="due-date"
                    type="button"
                    data-toggle="dropdown"
                    selected={this.props.date}
                    onChange={this.props.dateChange}
                    dateFormat='Pp'
                    showTimeSelect
                    filterDate={x => x > new Date()}
                />
            )
        }
    }
}

function Finish (props) {
    let color = "black"
    if(props.cross === "cross"){
        color = "gray"
    }
    return(
        <div className={"left col"}>
            <button type="button" className={"finished " + color} onClick={() => props.finish(props.i)}>
                finished
            </button>
        </div>
    );
}

function Clear(props) {
    return(
        <div className={"col"}>
            <button type="button" className = "clear" onClick={() => props.clear(props.i)}>
                clear
            </button>
        </div>
    )
}

class Entry extends React.Component {
    render() {
        const timeString = timeConvert(new Date(this.props.due).toString())
        return(
            <div className={"list row"}>
              <div className={this.props.class + " col"}>
                {this.props.task}
              </div>
              <div className={"col"}>
                  {timeString}
              </div>
              <div className={"col"} style={{flexDirection: 'row', flex: 0.7}}>
              <Finish
                  finish={this.props.finished}
                  i={this.props.i}
                  cross = {this.props.class}
              />
              <Clear
                  clear={this.props.clear}
                  i={this.props.i}
              />
              </div>
            </div>
        );
    }
}

class Submit extends React.Component {
  render() {
    return(
      <button type="button" style ={{marginBottom: 15, marginRight: 15, display: 'inline-block', flexWrap: "wrap"}}
              class="submit" value="Submit" onClick={() => this.props.submitted()}>
        Submit
      </button>
    );
  }
}

class List extends React.Component {
  renderEntry(i) {
    return(
      <Entry
        task = {this.props.todos[i]}
        due = {this.props.dueDates[i]}
        class = {this.props.classes[i]}
        finished = {this.props.finished}
        clear = {this.props.clear}
        i= {i}
      />
    );
  }

  render() {
    return(
      <div className={"row"} style={{display: 'flex', width: '750px'}}>
      {this.props.ranger.map(j => {
        return (
          this.renderEntry(j)
        );
      })}
      </div>
    );
  }
}

const localizer = momentLocalizer(moment)

class MyCalendar extends React.Component {
    render(){
        return(
            <div>
                <Calendar
                    localizer={localizer}
                    showMultiDayTimes
                    events={this.props.eventList}
                    startAccessor="start"
                    endAccessor="end"
                    defaultDate={moment().toDate()}
                    style={{ zIndex: '-1', height: 500, width: 750 }}
                />
            </div>
        )
    }
}


class HomeworkTracker extends React.Component {
  constructor(props){
    super(props);
    const newDate = new Date()
    this.state = {
      content: '',
      checked: false,
      weekly: false,
      ogDate: newDate,
      date: newDate,
      todos: ls.get('todos') || [],
      dues: dParse(ls.get('dues')) || [],
      activeStarts: dParse(ls.get('ht_activeStarts')) || [],
      ranger: ls.get('ht_ranger') || [],
      classes: ls.get('ht_classes') || [],
      chosen: 'input time',
      options: ['due(soonest)', 'due(latest)', 'assignment length'],
      eventList: ls.get('eventList') || []
    };
  }
  handleSubmit() {
    if(this.state.content !== '' && this.state.date > this.state.ogDate) {
        const newList = this.state.todos.concat(this.state.content)
        var utcDate = new Date(this.state.date.getTime() + this.state.date.getTimezoneOffset() * 60000);
        let newDate = [utcDate];
        if(this.state.weekly){
            let later = new Date(this.state.date.getTime())
            later.setFullYear(later.getFullYear() + 1)
            newDate = new RRule({
              freq: RRule.WEEKLY,
              dtstart: utcDate,
              until: new Date(later.getTime() + later.getTimezoneOffset() * 60000)
            }).all()
        }

        const newDues = this.state.dues.concat(this.state.date)
        const newActives = this.state.activeStarts.concat(this.state.date).concat(this.state.content)
        const newClasses = this.state.classes.concat('un-crossed')
        let newRanger = []
        if (this.state.checked){
            newRanger = this.state.ranger.concat(this.state.ranger.length)
        }
        let dt = new Date(this.state.date.getTime());
        dt.setHours(dt.getHours() - 2);
        const newEvents = this.state.eventList.concat(
            newDate.map(j => toEvent(this.state, j)))
        this.setState({
            todos: newList,
            content: "",
            dues: newDues,
            activeStarts: newActives,
            classes: newClasses,
            ranger: newRanger,
            eventList: newEvents,
            date: this.state.ogDate,
        });
        ls.set('todos', newList)
        ls.set('dues', newDues)
        ls.set('ht_activeStarts', newActives)
        ls.set('ht_classes', newClasses)
        ls.set('ht_ranger', newRanger)
        ls.set('eventList', newEvents)
    }
  }

  handleChange(event){
    this.setState({
      content: event.target.value
    });
  }

  enterCheck(event) {
    if(event.key === 'Enter'){
      this.handleSubmit()
      event.preventDefault()
    }
  }

  dateChange(event) {
      this.setState({
          date: event
       });
  }

  weeklyChange() {
      this.setState({
          weekly: !this.state.weekly
      })
  }

  checkChange(){
      const opp = !this.state.checked
      let newRanger;
      if(opp){
          newRanger = Array.from({length: this.state.todos.length}, (x, i) => i)
      }
      else{
          newRanger = []
      }
      this.setState ({
          checked: opp,
          ranger: newRanger
      })
      ls.set('ht_ranger', newRanger)
  }

  finished(i) {
     const new_list = this.state.ranger.map(
              j => ((i === j) ? 'cross' : this.state.classes[j]))
     const new_actives = maintainActive(this.state.activeStarts, this.state.dues[i])
     this.setState({
         classes: new_list,
         activeStarts: new_actives,
      });
     ls.set('ht_classes', new_list)
     ls.set('ht_activeStarts', new_actives)
  }

  clear(i) {
      const new_events = eventRemove(this.state.eventList, i)
      const new_entries = removeIndex(this.state.todos, i)
      const new_actives = maintainActive(this.state.activeStarts, this.state.dues[i])
      const new_dues = removeIndex(this.state.dues, i)
      const new_classes = removeIndex(this.state.classes, i)
      const new_ranger = removeIndex(this.state.ranger, this.state.ranger.length - 1)
      this.setState({
          todos: new_entries,
          dues: new_dues,
          activeStarts: new_actives,
          classes: new_classes,
          ranger: new_ranger,
          eventList: new_events
      })
      ls.set('todos', new_entries)
      ls.set('dues', new_dues)
      ls.set('ht_tarts', new_actives)
      ls.set('ht_classes', new_classes)
      ls.set('ht_ranger', new_ranger)
      ls.set('eventList', new_events)
  }

  sorter(event){
     const newOptions = removeAdd(this.state.options, event.target.value, this.state.chosen)
     this.setState({
         chosen: event.target.value,
         options: newOptions
     })
  }

  render() {
    return (
        <div className="container">
            <div>
          <Title />
          <div style ={{textAlign: 'left', alignSelf: 'center', marginTop: 0}}>
              <title>
                  homework log
              </title>
              <h3 className="title" style={{width: 750, textAlign: "center"}}>
                  Homework Tracker
              </h3>
                  <List
                    todos={this.state.todos}
                    dueDates={this.state.dues}
                    ranger={this.state.ranger}
                    classes={this.state.classes}
                    finished = {this.finished.bind(this)}
                    clear= {this.clear.bind(this)}
                  />
              <Input
                typed = {this.state.content}
                changes= {this.handleChange.bind(this)}
                enterCheck = {this.enterCheck.bind(this)}
                ogDate = {this.state.ogDate}
                date = {this.state.date}
                dateChange = {this.dateChange.bind(this)}
                weekly = {this.state.weekly}
                weeklyChange = {this.weeklyChange.bind(this)}
              />
              <div style ={{display: 'block', width: 622}}>
                  <Submit
                    submitted = {() => this.handleSubmit()}
                  />
                  <ShowList
                    checked= {this.state.checked}
                    checkChange={this.checkChange.bind(this)}
                  />
                  {/*<SortBy*/}
                  {/*  sorter = {this.sorter.bind(this)}*/}
                  {/*  chosen = {this.state.chosen}*/}
                  {/*  options = {this.state.options}*/}
                  {/*/>*/}
              </div>
          </div>
          <br/>
          <br/>
          <MyCalendar
              eventList = {this.state.eventList}
          />
          </div>
        </div>
    );
  }
}

function removeIndex(list, j){
    list.splice(j, 1)
    return list
}

function maintainActive(list, item){
    let i;
    for (i = 0; i < list.length; i++) {
        if(i % 2 ===0){
            if(list[i].valueOf() ===item.valueOf()){
                list.splice(i, 2)
            }
        }
    }
    return list
}

function removeAdd(list, toRemove, toAdd){
   let newList = []
   newList = newList.concat(toAdd)
   let i;
    for (i = 0; i < list.length; i++) {
        if(list[i] !== toRemove){
            newList = newList.concat(list[i])
        }
    }
    newList.sort(function(a, b){return a-b})
    return newList
}

function timeConvert(timeString) {
    const split = timeString.split(':')
    let newTime = split[0].split(' ')
    let numHelp = parseInt(newTime[newTime.length - 1])
    if(numHelp < 12){
       return split[0] + ":" + split[1] + ' AM'
    }
    else{
       newTime[newTime.length - 1] = (numHelp - 12).toString()
        return newTime.join(' ') + ':' + split[1] + ' PM'
    }
}

function eventRemove(events, id){
    let i
    let newList = []
    console.log("id: " + id.toString())
    console.log(events)
    for (i = 0; i < events.length; i++) {
        if(events[i].id !== id){
            newList = newList.concat(events[i])
        }
    }
    return newList
}

function dParse(list){
    if(list !== null){
        return list.map(j=>j > 0 ? j : Date.parse(j))
    }
    else{
        return null
    }
}

function toEvent(state, date) {
   let dt = new Date(date.getTime());
   dt.setHours(dt.getHours() - 2);
   return {
       id: state.ranger.length,
       title: state.content,
       start: dt,
       end: date
   }
}
export default HomeworkTracker;
