<template>
  <div id="app" class="w-full">
    <ckeditor
      :editor="editor"
      v-model="propsValue"
      :config="editorConfig"
      :disabled="!canEdit"></ckeditor>
  </div>
</template>

<script setup lang="ts">
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing'
import '@ckeditor/ckeditor5-source-editing/build/translations/zh'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Heading } from '@ckeditor/ckeditor5-heading'
import '@ckeditor/ckeditor5-heading/build/translations/zh'
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from '@ckeditor/ckeditor5-basic-styles'
import '@ckeditor/ckeditor5-basic-styles/build/translations/zh'

import { BlockQuote } from '@ckeditor/ckeditor5-block-quote'
import '@ckeditor/ckeditor5-block-quote/build/translations/zh'
import { Alignment } from '@ckeditor/ckeditor5-alignment'
import '@ckeditor/ckeditor5-alignment/build/translations/zh'
import { FontSize, FontFamily, FontColor, FontBackgroundColor } from '@ckeditor/ckeditor5-font'
import '@ckeditor/ckeditor5-font/build/translations/zh'
import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  ImageResizeEditing,
  ImageResizeHandles,
} from '@ckeditor/ckeditor5-image'
import '@ckeditor/ckeditor5-image/build/translations/zh'
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload'
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line'
import '@ckeditor/ckeditor5-horizontal-line/build/translations/zh'
import { ListProperties } from '@ckeditor/ckeditor5-list'
import '@ckeditor/ckeditor5-list/build/translations/zh'

import {
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TableColumnResize,
  TableCaption,
} from '@ckeditor/ckeditor5-table'
import '@ckeditor/ckeditor5-table/build/translations/zh'
import { AutoLink, LinkImage } from '@ckeditor/ckeditor5-link'
import '@ckeditor/ckeditor5-link/build/translations/zh'
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support'
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed'
import '@ckeditor/ckeditor5-media-embed/build/translations/zh'
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format'
import '@ckeditor/ckeditor5-remove-format/build/translations/zh'

const props = defineProps({
  modelValue: { type: String, default: '' },
  canEdit: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])

const propsValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  },
})

const editor = ClassicEditor
const editorConfig = reactive<any>({
  language: 'zh',
  plugins: [
    SourceEditing,
    Paragraph,
    Essentials,
    Bold,
    Code,
    Italic,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
    BlockQuote,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    ImageResizeEditing,
    ImageResizeHandles,
    Base64UploadAdapter,
    FontSize,
    FontFamily,
    FontColor,
    FontBackgroundColor,
    Heading,
    Alignment,
    HorizontalLine,
    ListProperties,
    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties,
    TableColumnResize,
    TableCaption,
    AutoLink,
    LinkImage,
    GeneralHtmlSupport,
    MediaEmbed,
    RemoveFormat,
  ],
  toolbar: {
    items: [
      'heading', // 标题
      'blockQuote', // 引用
      '|',
      'fontSize', // 字体大小
      'fontFamily', // 字体
      'fontColor', // 字体颜色
      'fontBackgroundColor', // 字体背景色
      'bold', // 加粗
      'italic', // 斜体
      'underline', // 下划线
      'strikethrough', // 删除线
      'bulletedList', // 无序列表
      'numberedList', // 有序列表
      'alignment', // 对齐方式
      'code', // 代码
      'insertTable', // 表格
      'imageUpload', // 图片上传
      'mediaEmbed', // 媒体嵌入
      'horizontalLine', // 水平线
      'link', // 链接
      '|',
      'undo', // 撤销
      'redo', // 撤销和重做
      'removeFormat', // 清除格式
      '|',
      'sourceEditing', // 源代码编辑
    ],
    shouldNotGroupWhenFull: true,
  },
  image: {
    toolbar: [
      'link',
      'imageTextAlternative',
      'toggleImageCaption',
      'imageStyle:inline',
      'imageStyle:alignLeft',
      'imageStyle:alignRight',
      'imageStyle:side',
      'imageStyle:alignBlockLeft',
      'imageStyle:alignBlockRight',
      'imageStyle:alignCenter',
      'imageStyle:block',
    ],
  },
  table: {
    contentToolbar: [
      'toggleTableCaption',
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableProperties',
      'tableCellProperties',
    ],
  },
  link: {
    decorators: {
      openInNewTab: {
        mode: 'manual',
        label: 'Open in a new tab',
        defaultValue: true,
        attributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      },
    },
  },
  fontSize: {
    supportAllValues: true,
    options: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  },
  fontFamily: {
    options: [
      'default',
      'Arial, Helvetica, sans-serif',
      'Courier New, Courier, monospace',
      'Georgia, serif',
      'Lucida Sans Unicode, Lucida Grande, sans-serif',
      'Tahoma, Geneva, sans-serif',
      'Times New Roman, Times, serif',
      'Trebuchet MS, Helvetica, sans-serif',
      'Verdana, Geneva, sans-serif',
    ],
  },
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
    ],
  },
  htmlSupport: {
    allow: [
      {
        name: /^(div|section|article|p|button|input|iframe|span)$/,
        styles: true,
        classes: true,
        attributes: true,
      },
    ],
    disallow: [
      {
        name: /.*/,
        attributes: ['on*'],
      },
    ],
  },
  mediaEmbed: {
    previewsInData: true,
  },
})
</script>
<style src="@/assets/scss/custom/ckeditor.scss"></style>
