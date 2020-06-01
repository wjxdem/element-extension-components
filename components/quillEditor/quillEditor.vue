<!--
/*@author: jesse wu
 *基于quill.js富文本编辑器，支持拖动上传图片
 *用法： <lu-quill-editor :quillEditorContent="quillEditorContent"></lu-quill-editor>
 * // 描述
 *  quillEditorContent: {
 *     content: ''
 *   },
 */
 -->
<template>
    <div class="lu-quill-editor">
        <div class="edit_container">
            <quill-editor
                    ref="myQuillEditor"
                    @ready="onEditorReady($event)"
                    @change="onEditorChange($event)"
                    :options="editorOption"
                    v-model="quillEditorContent.content">
            </quill-editor>
        </div>
    </div>
</template>
<script src="./quillEditor.js"></script>
