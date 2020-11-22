import React from 'react';
import ls from 'local-storage';
 import { Editor } from '@tinymce/tinymce-react';

// import ReactDOM from 'react-dom';
// import BraftEditor from 'braft-editor'
// import 'braft-editor/dist/index.css'
// import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
// import 'draft-js/dist/Draft.css';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// class MessageCenter extends React.Component {
//   constructor(props) {
//     super(props);
//
//     let initialEditorState = null;
//     // const storeRaw = ls.get('draft_raw');
//     //
//     // if (storeRaw) {
//     //   const rawContentFromStore = convertFromRaw(JSON.parse(storeRaw));
//     //   initialEditorState = EditorState.createWithContent(rawContentFromStore);
//     // } else {
//     //   initialEditorState = EditorState.createEmpty();
//     // }
//
//     this.state = {
//       editorState: initialEditorState
//     }
//   }
//   //
//   messageChange(event) {
//     this.setState({editorState: event})
//     // ls.set('draft_raw', JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())));
//     // console.log(ls.get('draft_raw'))
//   }
//   //
//   // render() {
//   //   const { editorState } = this.state;
//   //   return (
//   //     <div>
//   //       <Editor
//   //         editorState={editorState}
//   //         wrapperClassName="demo-wrapper"
//   //         editorClassName="demo-editor"
//   //         onEditorStateChange={this.onEditorStateChange}
//   //       />
//   //       <textarea
//   //         disabled
//   //         value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
//   //       />
//   //     </div>
//   //   );
//   // }
//   render() {
//     const editorState = this.state;
//     return(
//         <Editor
//           editorState={editorState}
//           toolbarClassName="toolbarClassName"
//           wrapperClassName="wrapperClassName"
//           editorClassName="editorClassName"
//           onEditorStateChange={this.messageChange.bind(this)}
//         />
//     );
//   }
// }

// class MessageCenter extends React.Component {
//   constructor(props) {
//     super(props);
//
//     let initialEditorState = null;
//     const storeRaw = ls.get('draft_raw');
//
//     // if (storeRaw) {
//     //   initialEditorState = BraftEditor.createEditorState(storeRaw)
//     // }
//
//     this.state = {
//       editorState: initialEditorState
//     }
//   }
//
//   // submitContent = async () => {
//   //   // Pressing ctrl + s when the editor has focus will execute this method
//   //   // Before the editor content is submitted to the server, you can directly call editorState.toHTML () to get the HTML content
//   //   const htmlContent = this.state.editorState.toHTML()
//   //   const result = await saveEditorContent(htmlContent)
//   // }
//
//   handleEditorChange = (editorState) => {
//   // }
//     this.setState({editorState: editorState })
//     if(this.state.editorState) {
//       ls.set('draft_raw', this.state.editorState.toHTML());
//       console.log(ls.get('draft_raw'))
//     }
//     // console.log(editorState.toText())
//   }
//
//   render () {
//
//     const { editorState } = this.state
//
//     return (
//       <div className="my-component">
//         <BraftEditor
//           value={editorState}
//           onChange={this.handleEditorChange}
//           language={'en'}
//           // onSave={this.submitContent}
//         />
//       </div>
//     )
//
//   }
//
// }

class TextEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text_content: ls.get('message') || ""
    }
  }
   handleEditorChange = (content, editor) => {
     console.log('Content was updated:', content);
     this.setState({text_content: content})
     ls.set('message', content);
     console.log(ls.get('message'))
   }

   render() {
    const init_content = this.state.text_content
     return (
       <Editor
         initialValue={init_content}
         init={{
           height: 500,
           menubar: false,
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount'
           ],
           toolbar:
             'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help'
         }}
         onEditorChange={this.handleEditorChange}
       />
     );
   }
 }

 class MessageCenter extends React.Component {
   render() {
     return (
         <div className="container">
         {/*/!*<Title*!/*/}
         {/*/!*    blurTitle={this.blurTitle.bind(this)}*!/*/}
         {/*/!*    curTime = {this.state.curTime}*!/*/}
         {/*/!*    activeStarts = {this.state.activeStarts}*!/*/}

         {/*<NewTitle />*/}
         <div>
         <h3 className="title" style={{width: 500, textAlign: "center"}}>
                  Message Center
         </h3>
          <TextEditor />
          </div>
          </div>

     );
   }
 }

export default MessageCenter;