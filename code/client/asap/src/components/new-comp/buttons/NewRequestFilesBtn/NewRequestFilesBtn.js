import apiService from '../../../../services/api/api';
import style from './NewRequestFilesBtn.module.css';
import FileUploadSign from '../../fileUploadSign/FileUploadSign';
import React from 'react';

const NewRequestFilesBtn = props => {
    const { files } = props;
    const handleLetterClick = async type => {
        try {
            const response = await apiService.AdminService.downloadFile(files['CV&Initiative Letter'][type]['url']);
            const downloadUrl = window.URL.createObjectURL(response.data);

            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = response.headers['content-disposition'].split('=')[1];
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error while downloading file:', error);
        }
    };

    return files && Object.keys(files).length !== 0 ? (
        <div className={style.wrapperFile}>
            {files['CV&Initiative Letter'] && Object.keys(files['CV&Initiative Letter']).includes('CV') ? (
                <button className={style.fileCard} onClick={() => handleLetterClick('CV')}>
                    <div className={style.InProcessCardSubCard}></div>
                    <FileUploadSign className={style.clickable} text={'קורות חיים'} />
                </button>
            ) : (
                <></>
            )}
            {files['CV&Initiative Letter'] &&
            Object.keys(files['CV&Initiative Letter']).includes('Initiative Letter') ? (
                <button className={style.fileCard} onClick={() => handleLetterClick('Initiative Letter')}>
                    <div className={style.InProcessCardSubCard}></div>
                    <FileUploadSign className={style.clickable} text={'מכתב יוזם'} />
                </button>
            ) : (
                <></>
            )}
        </div>
    ) : (
        <></>
    );
};

export default NewRequestFilesBtn;
