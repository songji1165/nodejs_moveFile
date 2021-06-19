const fs = require('fs'); // 파일시스템 가져오기
const path = require('path');
const process = require('process');


// console.log(path.basename(__filename)); // 현재 세부 파일명 clearFile.js
// console.log(path.basename(__filename,'.js')); // 현재 파일명 clearFile

// console.log(__dirname); // 현재 파일의 디렉터리 정보 /Users/eunji/Desktop/study/node/Test1-clearFiles
            //  동일 : path.dirname(__filename)
// console.log(__filename); // 현재 파일의 디렉터리 및 파일 정보 /Users/eunji/Desktop/study/node/Test1-clearFiles/clearFile.js

// console.log(path.delimiter); // 환경변수구분 ':'
// console.log(path.sep); // 경로구분자 '/'
// console.log(path.extname(__filename)); //현재 파일의 확장자 추출 '.js'

//const parsed = path.parse(__filename); // 현재 파일의 세부정보 obj 추출
/* {
  root: '/',
  dir: '/Users/eunji/Desktop/study/node/Test1-clearFiles',
  base: 'clearFile.js',
  ext: '.js',
  name: 'clearFile'
} */
//console.log(path.format(parsed)); // parsed 다시 복구 /Users/eunji/Desktop/study/node/Test1-clearFiles/clearFile.js

// path 합성 /Users/eunji/Desktop/study/node/Test1-clearFiles/image
// console.log(__dirname + path.sep + 'image');
// console.log(path.join(__dirname, 'image'));

// const args = process.argv;
/*
 # Node.js 프로세스가 시작될 때 전달 된 명령 줄 인수가 포함 된 배열을 반환
    args[0] : node 정보
    args[1] : 현재 파일 정보
    args[~] : 전달받은 인자 정보
 */

//const files = fs.readdirSync('./'); //현재 경로의 디렉터리의 모든 파일 return Arr

// ====================================================================================================================================

/*
/**
 * POSIX (Unix : Mac, Linux) : 'Users/temp/myfile.html'
 * Windows: 'C:\\temp\myfile.html'
 */

const Dir ='/Users/eunji/Desktop/study/node/Test1-clearFiles/Picture'; // 기본경로

const subDir = process.argv[2];
if(!subDir){
   throw new Error("해당 경로의 폴더가 없습니다.");
}
const moveDir = path.join(Dir, subDir); // 최종 경로

makeDir('video');
makeDir('duplicated');
makeDir('captured');

const videoFiles = [];
const caputredFiles = [];
let duplicatedFiles;
const jpgFiles = [];

// 파일 구분
fs.readdirSync(moveDir).forEach((file, idx)=>{
    const extName = path.extname(file);

    switch (extName){
        case ('.mov') :
            videoFiles.push(file);
            break;
        case ('.mp4') :
            videoFiles.push(file);
            break;
        case ('.png') :
            caputredFiles.push(file);
            break;
        case ('.aae') :
            caputredFiles.push(file);
            break;
        case '.jpg' :
            jpgFiles.push(file);
            break;
    }
});


/* 이미지파일 재분류 (복사본 IMG_E*.jpg 는 제외) */
// 이미지 파일의 순수 이름
const jpgFilesBaseName = jpgFiles.map(jpgFile => {
    const baseName = path.basename(jpgFile,'.jpg');
    return  baseName.split('IMG_')[1];
});
// 복사본 제외한 이미지 파일의 순수 이름
const originalJpgFiles = jpgFilesBaseName.filter(file => {
    if(file.indexOf('E',0) == 0){
        const compareName = file.substr(1); // 복사본의 원본 이름 추출
        if(jpgFilesBaseName.indexOf(compareName) > -1){ // 복사본의 원본 이름 있는 경우 중복 파일임 => 해당 복사본은 이동하지 않는다.
            return false;
        }
    }
    return true;
});

duplicatedFiles = originalJpgFiles.map(fileName => {
    return 'IMG_'+fileName+'.jpg';
});

console.log('파일 분류됨', videoFiles)
console.log('파일 분류됨', caputredFiles)
console.log('파일 분류됨', duplicatedFiles)

moveFile(videoFiles, 'video');
moveFile(caputredFiles, 'captured');
moveFile(duplicatedFiles, 'duplicated');

//파일 생성
function makeDir (dirName){
    fs.mkdir(path.join(moveDir,dirName),e=>{
        if(e) throw new Error(e, ':', dirName, '파일을 생성 할 수 없습니다.');
        console.log(dirName, '파일을 생성했습니다.');
    });
}

//파일 이동
// TODO : 폴더 중복 체크 필요
function moveFile(files, toDir){
    const filesLen = files.length;
    files.forEach((file, idx) => {
        const currentDir = path.join(moveDir, file);
        const moveToDir = path.join(moveDir, toDir);
        const newDir = path.join(moveToDir, file);
        fs.rename(currentDir, newDir, e=> {
            if(e) new Error(`${e} : ${file} 파일을 ${toDir} 폴더로 이동하지 못했습니다.`);

            if(idx === (filesLen -1)){
                console.log(currentDir);
                console.log(newDir);
                console.log(`${toDir} 폴더에 ${filesLen}개의 파일이 이동되었습니다.`);
            }
        });
    })
}



