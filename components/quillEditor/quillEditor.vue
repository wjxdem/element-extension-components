<!--
/*@author: jesse wu
 *基于quill.js富文本编辑器，支持拖动上传图片
 *用法： <quill-editor :quillEditorContent="quillEditorContent"></quill-editor>
 * // 描述
 *  quillEditorContent: {
 *     content: ''
 *   },
 */
 -->
<template>
    <div class="quill-editor">
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
