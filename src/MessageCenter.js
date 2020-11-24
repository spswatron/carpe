import React from 'react';
import ls from 'local-storage';
 import { Editor } from '@tinymce/tinymce-react';
import { Helmet } from 'react-helmet';
import './index.css'

class NewTitle extends React.PureComponent {
  render () {
    return (
      <>
        <Helmet>
          <title>Notes To Self</title>
        </Helmet>
      </>
    )
  }
}


class TextEditor extends React.Component {

   render() {
     return (
       <>
       <Editor
         initialValue={this.props.text_content}
         init={{
           height: 500,
           menubar: false,
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code',
             'insertdatetime media table paste code help wordcount'
           ],
           toolbar:
             'undo redo | formatselect | bold italic forecolor backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent| help'
         }}
         onEditorChange={this.props.handleEditorChange}
       />
       </>
     );
   }
 }

 class MessageCenter extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      text_content: ls.get('message') || ""
    }
  }
   handleEditorChange = (content, editor) => {
     this.setState({text_content: content})
     ls.set('message', content);
   }
   render() {
    const content = this.state.text_content
    const { htmlToText } = require('html-to-text');
    const text = htmlToText(content, {
      wordwrap: 130
    });
    let blob = new Blob([text], {type: "application/txt"});
    const newLink = window.URL.createObjectURL(blob)
    const currDay = new Date().getDay().toString()
    const Day = new Date().toISOString().slice(0,10).replaceAll(" ", "-")
    const fileName = "note-to-self-" + Day + ".txt"
     return (
         <div className="container">
         <div>
         <NewTitle />

         <h3 className="title" style={{width: 500, textAlign: "center"}}>
                  Notes To Self
         </h3>
          <TextEditor
              text_content = {this.state.text_content}
              handleEditorChange = {this.handleEditorChange.bind(this)}
          />
           <div className={"note"}>
               <div style={{display: 'flex'}}>
               <a href={newLink} download={fileName}><button className={"submit"} style ={{maxWidth: '6rem', marginRight: '1rem'}}>Download</button></a>
               {/*<a href={newLink} download><button className={"submit"} style ={{minWidth: '4rem'}}>Save</button></a>*/}
               </div>
           </div>
            </div>
          </div>

     );
   }
 }

export default MessageCenter;