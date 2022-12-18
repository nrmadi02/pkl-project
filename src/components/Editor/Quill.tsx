// import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useQuill } from 'react-quilljs';
// import { toast } from "react-toastify";
import 'quill/dist/quill.snow.css';
import { NextPage } from 'next';
// import { useSelector } from 'react-redux';

interface Props {
    setEditorState: any,
    editor: string,
    withImage: boolean
}

const Editor: NextPage<Props> = ({setEditorState, editor, withImage}) => {

//   const { data: state } = useSelector((state) => state.userData)

    const modules = {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ align: [] }],
      
          [{ list: 'ordered'}, { list: 'bullet' }],
          [{ indent: '-1'}, { indent: '+1' }],
      
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['link', withImage && 'image'],
      
          ['clean'],
        ],
        clipboard: {
          matchVisual: false,
        },
      }
  
     const formats = [
        'bold', 'italic', 'underline', 'strike',
        'align', 'list', 'indent',
        'size', 'header',
        'link', withImage && 'image',
        'color', 'background',
        'clean',
      ] as string[]

    const { quill, quillRef } = useQuill({formats: formats, modules});

    // Insert Image(selected by user) to quill
    // const insertToEditor = (url) => {
    //     const range = quill.getSelection();
    //     quill.insertEmbed(range.index, 'image', url);
    // };

    // // Upload Image to Image Server 
    // const saveToServer = async (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     const res = await axios({
    //         method: 'POST',
    //         url: '/api-learning/learning/v1/image',
    //         headers: {
    //             'Authorization': `Bearer ${state.token}`,
    //             'accept': 'application/json',
    //             'Content-Type': 'multipart/form-data'
    //     },
    //         data: formData
    //     })

    //     if(res.data.success){
    //     toast.success('Success upload image', {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true
    //     });
    //         console.log(res.data.data);
    //         insertToEditor(res.data.data.logo_url);
    //         return res.data.data.logo_url;
    //     } else {
    //         toast.error('Failed upload image');
    //         console.log(res.data);
    //         return undefined;
    //     } 
    // };

    // // Open Dialog to select Image File
    // const selectLocalImage = () => {
    //     const input = document.createElement('input');
    //     input.setAttribute('type', 'file');
    //     input.setAttribute('accept', 'image/*');
    //     input.click();
    //     input.onchange = () => {
    //     const file = input.files[0];
    //     saveToServer(file);
    //     };
    // };


    useEffect(() => {
    if (quill) {
        // withImage && quill.getModule('toolbar').addHandler('image', selectLocalImage);
        quill.on('text-change', (delta, oldDelta, source) => {
            // console.log(quill.root.innerHTML.length); 
            quill.root.innerHTML.length > 15 ? setEditorState(quill.root.innerHTML) : setEditorState("");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quill]);

    useEffect(() => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(editor);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quill])

    return (
        <div className='pb-10'>
            <div style={{ width: '100%', height:"150px", minHeight: "200px", marginBottom: 10}}>
                <div ref={quillRef} />
            </div>
        </div>
    )
}

export default Editor;
