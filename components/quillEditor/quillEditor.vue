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
