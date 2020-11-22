import React from 'react';
import ls from 'local-storage';
 import { Editor } from '@tinymce/tinymce-react';
import { Helmet } from 'react-helmet';

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
         <NewTitle />
         <div>
         <h3 className="title" style={{width: 500, textAlign: "center"}}>
                  Notes To Self
         </h3>
          <TextEditor />
          </div>
          </div>

     );
   }
 }

export default MessageCenter;