import React from 'react';
import './index.css';
import { Helmet } from 'react-helmet';
import ls from 'local-storage';


class NewTitle extends React.PureComponent {
  render () {
    return (
      <>
        <Helmet>
          <title>Elapsify</title>
        </Helmet>
      </>
    )
  }
}


class Title extends React.Component {
    render() {
        let time = 'Elapsify'
        let task = "Elapsify"
        if (this.props.activeStarts.length > 0){
            time = fullTimeConvert(this.props.curTime - this.props.activeStarts[0])
            task = (' -> ').concat(this.props.activeStarts[1])
            task = this.props.activeStarts[1]
        }
        return(
            <Helmet>
                <title onBlur={() => this.props.blurTitle()}>{task}</title>
            </Helmet>
        )
    }
}

class MorningRoutine extends React.Component {
    render() {
        return (
            <div className="morning-routine" style={{display: 'flex', alignItems:'center', height: '30px'}}>
                <input style={{marginLeft: '7px'}}
                    className="form-check-input"
                       type="checkbox" value={this.props.checked}
                       onChange={() => this.props.checkChange()}
                       id="defaultCheck1"/>
                    <label style={{marginLeft: '3px'}} htmlFor="defaultCheck1">
                        morning routine
                    </label>
            </div>
        )
    }
}

class Input extends React.Component {
  render() {
    return(
      <input type="text" className="form-control"
               style ={{marginRight: '20'}}
               placeholder="Todo..."
               aria-label="Todo"
               aria-describedby="basic-addon2"
               value={this.props.typed}
               onChange={this.props.changes}
               onKeyPress={this.props.enterCheck}
      />
    );
  }
}

class Submit extends React.Component {
  render() {
    return(
      <button type="button"
              style ={{marginTop:20}}
              className="submit" value="Submit" onClick={() => this.props.submitted()}>
        Submit
      </button>
    );
  }
}

function Finish (props) {
    let color = "black"
    if(props.cross === "cross"){
        color = "gray"
    }
    return(
        <div className="left col">
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
        let elapsed
        if(this.props.class === 'cross'){
            elapsed =  (this.props.stopTimes[this.props.i] - this.props.startTimes[this.props.i])
        }
        else{
            elapsed =  (this.props.curTime - this.props.startTimes[this.props.i])
        }
        const timeString = fullTimeConvert(elapsed)
        // timeAlert(this.props.curTime - this.props.startTimes[this.props.i], this.props.content)
        return(
            <>
                {/*<hr/>*/}
            <div className="list row" key={this.props.i}>
              <div style = {{width: 200}} className={this.props.class + " col"}>
                {this.props.content}
              </div>
              <div className="col" >
                  {timeString} elapsed
              </div>
              <div className="col" style={{flexDirection:'row'}}>
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
                </>
        );
    }
}

class List extends React.Component {
  renderEntry(i) {
    return(
      <Entry
        class = {this.props.classes[i]}
        content = {this.props.entries[i]}
        curTime = {this.props.curTime}
        startTimes = {this.props.startTimes}
        stopTimes = {this.props.stopTimes}
        finished = {this.props.finished}
        clear = {this.props.clear}
        i= {i}
      />
    );
  }

  render() {
    return(
      <React.Fragment>
      {this.props.ranger.map(j => {
        return (
          this.renderEntry(j)
        );
      })}
      </React.Fragment>
    );
  }
}

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    const newDate = new Date()
    const xyz = ls.get('startTimes')
    this.state = {
      entries: ls.get('entries') || [],
      content: "",
      checked: false,
      startTimes: dParse(ls.get('startTimes')) || [],
      activeStarts: dParse(ls.get('activeStarts')) || [],
      stopTimes: dParse(ls.get('stopTimes')) || [],
      curTime: newDate,
      date: newDate.getDay(),
      classes: ls.get('classes') || [],
      ranger: ls.get('ranger') || []
    };
  }

  componentDidMount() {
      localStorage.clear()
      setInterval(() => {
        const newDate = new Date()
        // if(this.state.checked && !(this.state.curTime.getDay() === this.state.date)) {
        if(!(this.state.curTime.getDay() === this.state.date)) {
            const contentList = ['100 push-ups', '100 lunges', '3 mile run',
            'shower', 'read Bible', 'journal', 'eat Chia', 'make Chia', '69 minutes research']
            const newList = this.state.entries.concat(contentList)
            const newDates = this.state.startTimes.concat(new Array(contentList.length).fill(newDate))
            const newActives = activeLengthen(this.state.activeStarts, contentList)
            const newClasses = this.state.classes.concat(new Array(contentList.length).fill('un-crossed'))
            const newRanger = rangersLengthen(this.state.ranger, contentList.length)
            const newStops= this.state.stopTimes.concat(new Array(contentList.length).fill(newDate))
            this.setState({
                curTime: newDate,
                date: newDate.getDay(),
                entries: newList,
                startTimes: newDates,
                activeStarts: newActives,
                stopTimes: newStops,
                classes: newClasses,
                ranger: newRanger
            })
            ls.set('entries', newList)
            ls.set('startTimes', newDates)
            ls.set('activeStarts', newActives)
            ls.set('stopTimes', newStops)
            ls.set('classes', newClasses)
            ls.set('ranger', newRanger)
        }
        else {
            this.setState({
                curTime: newDate
            })
        }
      }, 1000)
    }

  handleSubmit() {
    if(this.state.content !== '') {
        const newDate = new Date()
        const newList = this.state.entries.concat(this.state.content)
        const newDates = this.state.startTimes.concat(newDate)
        const newActives = this.state.activeStarts.concat(newDate).concat(this.state.content)
        const newClasses = this.state.classes.concat('un-crossed')
        const newRanger = this.state.ranger.concat(this.state.ranger.length)
        const newStops = this.state.stopTimes.concat(newDate)
        this.setState({
            entries: newList,
            content: "",
            startTimes: newDates,
            activeStarts: newActives,
            stopTimes: newStops,
            classes: newClasses,
            ranger: newRanger
        });
        ls.set('entries', newList)
        ls.set('startTimes', newDates)
        ls.set('activeStarts', newActives)
        ls.set('stopTimes', newStops)
        ls.set('classes', newClasses)
        ls.set('ranger', newRanger)
    }
  }

  checkChange(){
      const opp = !this.state.checked
      this.setState ({
          checked: opp,
          date: (new Date()).getDay()
      })
  }

  handleChange(event){
    this.setState({
      content: event.target.value
    });
  }

  enterCheck(event) {
    if(event.key === 'Enter'){
      this.handleSubmit()
        event.preventDefault();
      }
  }

  blurTitle(){
    let time = 'Elapsify'
    let task = ''
    if (this.state.activeStarts.length > 0){
            time = fullTimeConvert(this.state.curTime - this.state.activeStarts[0])
            task = (' -> ').concat(this.state.activeStarts[1])
    }
    return(
          <Helmet>
            <title>{time}{task}</title>
          </Helmet>
        )
    }

  finished(i) {
      console.log(i);
      console.log(this.state);
      if(this.state.startTimes[i].valueOf() ===
          this.state.stopTimes[i].valueOf()) {
          const new_list = this.state.ranger.map(
              j => ((i === j) ? 'cross' : this.state.classes[j]))
          console.log(new_list);
          const new_stops = this.state.ranger.map(
              j => ((i === j) ? new Date() : this.state.stopTimes[j]))
          const new_actives = maintainActive(this.state.activeStarts, this.state.startTimes[i])
          this.setState({
              classes: new_list,
              activeStarts: new_actives,
              stopTimes: new_stops
          })
          ls.set('classes', new_list)
          ls.set('activeStarts', new_actives)
          ls.set('stopTimes', new_stops)
      }
  }

  clear(i) {
      const new_entries = removeIndex(this.state.entries, i)
      const new_actives = maintainActive(this.state.activeStarts, this.state.startTimes[i])
      const new_startTimes = removeIndex(this.state.startTimes, i)
      const new_stopTimes = removeIndex(this.state.stopTimes, i)
      const new_classes = removeIndex(this.state.classes, i)
      const new_ranger = removeIndex(this.state.ranger, this.state.ranger.length - 1)
      this.setState({
          entries: new_entries,
          startTimes: new_startTimes,
          activeStarts: new_actives,
          stopTimes: new_stopTimes,
          classes: new_classes,
          ranger: new_ranger
      })
      ls.set('entries', new_entries)
      ls.set('startTimes', new_startTimes)
      ls.set('activeStarts', new_actives)
      ls.set('stopTimes', new_stopTimes)
      ls.set('classes', new_classes)
      ls.set('ranger', new_ranger)
  }

  render(){
    return(
      <div className="container">
          <div>
         {/*<Title*/}
         {/*    blurTitle={this.blurTitle.bind(this)}*/}
         {/*    curTime = {this.state.curTime}*/}
         {/*    activeStarts = {this.state.activeStarts}*/}
         {/*/>*/}
         <NewTitle />
         <h3 className="title" style={{width: 500, textAlign: "center"}}>
                  Elapsify
         </h3>
          <List
            classes = {this.state.classes}
            curTime = {this.state.curTime}
            clear= {this.clear.bind(this)}
            entries = {this.state.entries}
            finished = {this.finished.bind(this)}
            ranger = {this.state.ranger}
            startTimes={this.state.startTimes}
            stopTimes={this.state.stopTimes}
          />
          <div style={{marginLeft: 0, marginTop: 0}} >
              <div className="row" style={{ padding: 0, alignContent: 'left', alignSelf: 'left', marginTop: '12px'}}>
                  <div className="col" style={{paddingLeft: 0}}>
                      <Input
                          typed = {this.state.content}
                          changes= {this.handleChange.bind(this)}
                          enterCheck = {this.enterCheck.bind(this)}
                      />
                  </div>
                  <div className="routine" style={{maxWidth: 160, paddingRight: 10, verticalAlign: 'sub'}}>
                      <MorningRoutine
                          checked= {this.state.checked}
                          checkChange={this.checkChange.bind(this)}
                      />
                  </div>
              </div>
          </div>
        <Submit
          submitted = {() => this.handleSubmit()}
        />
        </div>
      </div>
    )
  }
}

function returnTime(duration, unit){
    duration += 1000
    if(unit === 'second'){
        return Math.floor((duration / 1000) % 60)
    }
    else if (unit === 'minute'){
        return Math.floor((duration / (1000 * 60)) % 60)
    }
    else if (unit === 'hour'){
        return Math.floor((duration / (1000 * 60 * 60)) % 24) +
            24 * Math.floor((duration / (1000 * 60 * 60)) / 24)
    }
}

function isInt(num){
    return num % 1 === 0
}

function toTimeString(num){
    if(num < 10 && num > -10){
        return "0" + num.toString()
    }
    else{
        return num.toString()
    }
}

function timeAlert(elapsed, content){
    const minuteCheck =  (elapsed / (1000 * 60)) % 60
    const hourCheck =  (elapsed / (1000 * 60 * 60)) % 24
    if(isInt(minuteCheck)) {
        if (isInt(hourCheck) && hourCheck > 1) {
            alert(hourCheck.toString() +
                'hours since you said you would' + content)
        } else if (isInt(hourCheck) && hourCheck === 1) {
            alert(hourCheck.toString() +
                'hour since you said you would' + content)
        } else if (isInt(minuteCheck) && minuteCheck > 1) {
            alert(minuteCheck.toString() +
                'minutes since you said you would' + content)
        } else if (isInt(minuteCheck) && minuteCheck === 1) {
            alert(minuteCheck.toString() +
                'minute since you said you would' + content)
        }
    }
}

function removeIndex(list, j){
    list.splice(j, 1)
    return list
}

function maintainActive(list, item){
    var i;
    for (i = 0; i < list.length; i++) {
        if(i % 2 ===0){
            if(list[i].valueOf()===item.valueOf()){
                list.splice(i, 2)
            }
        }
    }
    return list
}

function fullTimeConvert(elapsed) {
      console.log(elapsed)
      const seconds = toTimeString(returnTime(elapsed, 'second'))
      const minutes = toTimeString(returnTime(elapsed, 'minute'))
      const hours = toTimeString(returnTime(elapsed, 'hour'))
      return hours.concat(":").concat(minutes).concat(":").concat(seconds)
}

function rangersLengthen(ranger, num){
    let numCheck = num
    let newRange = ranger
    while(numCheck > 0){
        newRange = newRange.concat(newRange.length)
        numCheck -= 1
    }
    return newRange
}

function activeLengthen(active, content){
    let temp = active
    let newDate = new Date()
    let i
    for (i = 0; i < content.length; i++) {
        temp = temp.concat(newDate).concat(content[i])
    }
    return temp
}

function dParse(list){
    if(list !== null){
        return list.map(j=>j > 0 ? j : Date.parse(j))
    }
    else{
        return null
    }
}


export default ToDo;
