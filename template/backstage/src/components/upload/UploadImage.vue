<template>
  <div class="w-full">
    <ul ref="uploadRef" class="draggable-upload flex h-full w-full flex-wrap gap-2">
      <li
        v-for="(item, index) of imgList"
        :key="index"
        class="draggable-upload-li relative h-[160px] w-[160px] bg-hd-bg">
        <article class="flex h-full w-full flex-col justify-between">
          <div class="flex h-full w-full justify-center">
            <el-image :src="item" fit="contain" class="h-full w-full"></el-image>
          </div>
        </article>
        <article
          class="absolute top-0 flex h-full w-full flex-col opacity-0 duration-300 hover:opacity-100">
          <div class="flex h-full w-full flex-col items-center bg-gray-100/70 delay-75">
            <div class="mt-auto flex justify-center gap-x-1 p-3 text-white">
              <div
                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-700 hover:bg-opacity-70"
                @click="actions.handleDownload(item, 'image')">
                <svg-icon name="download-image" class="h-5 w-5"></svg-icon>
              </div>
              <div
                v-if="!disabled"
                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-700 hover:bg-opacity-70"
                @click="actions.handleDelete(index)">
                <svg-icon name="delete"></svg-icon>
              </div>
            </div>
          </div>
        </article>
      </li>
      <div>
        <el-upload
          v-if="imgList.length < max"
          class="h-[160px] w-[160px]"
          action="#"
          drag
          :multiple="true"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="actions.handleUpload">
          <template #trigger>
            <div class="flex h-full w-full items-center justify-center">
              <svg-icon name="plus"></svg-icon>
            </div>
          </template>
        </el-upload>
      </div>
    </ul>

    <el-dialog v-model="state.dialogVisible" class="relative h-2/3 max-md:w-[95%]">
      <vue-cropper
        ref="cropper"
        :img="state.imageUrl"
        :output-size="state.option.size"
        :output-type="state.option.outputType"
        :info="true"
        :full="state.option.full"
        :can-move="state.option.canMove"
        :can-move-box="state.option.canMoveBox"
        :fixed-box="state.option.fixedBox"
        :original="state.option.original"
        :auto-crop="state.option.autoCrop"
        :auto-crop-width="state.option.autoCropWidth"
        :auto-crop-height="state.option.autoCropHeight"
        :center-box="state.option.centerBox"
        :fixed="true"
        :high="state.option.high"
        mode="cover"
        :max-img-size="state.option.max" />
      <template #footer>
        <span>
          <el-button @click="state.dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="actions.handleCropper">OK</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import Sortable from 'sortablejs'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    max?: number
    disabled?: boolean
    cropper?: boolean
  }>(),
  {
    modelValue: () => [],
    max: 10,
    disabled: false,
    cropper: false,
  },
)
// ----------- emit -----------
const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
}>()

const state = ref({
  drag: false,
  dragOptions: {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost',
  },
  dialogVisible: false,
  imageUrl: '',
  imageName: '',
  option: {
    size: 1,
    full: false,
    outputType: 'png',
    canMove: true,
    fixedBox: false,
    original: false,
    canMoveBox: true,
    autoCrop: true,
    // 只有自动截图开启 宽度高度才生效
    autoCropWidth: 200,
    autoCropHeight: 200,
    centerBox: false,
    high: true,
    max: 99999,
  },
})

const cropper = ref<typeof VueCropper>()
const uploadRef = ref<HTMLElement | null>(null)

// ----------- computed ----------
const imgList = computed({
  get: () => props.modelValue || [],
  set: (val) => {
    emit('update:modelValue', val)
  },
})

onMounted(() => {
  if (!props.disabled) {
    actions.handleDrag()
  }
})

const actions = {
  handleUpdateList: (list: any) => {
    emit('update:modelValue', list)
  },

  /**
   * @description 刪除檔案
   */
  handleDelete(index: number) {
    const filterData = imgList.value.filter((item, i) => i !== index)
    emit('update:modelValue', filterData)
  },
  /**
   * @description 下載檔案
   */
  handleDownload: async (file: string, fileName: string) => {
    try {
      const blob = actions.base64ToBlob(file)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log(error)
      mesBox.error({
        title: '下載發生錯誤，請稍後再試',
        subTitle: '',
      })
    }
  },

  handleUpload: (uploadFile: any) => {
    if (uploadFile.raw?.type !== 'image/jpeg' && uploadFile.raw?.type !== 'image/png') {
      notification.error({
        title: '上傳的檔案類型不符合(jpg, png)',
      })
      return false
    } else if (uploadFile.raw?.size / 1024 / 1024 > 5) {
      notification.error({
        title: '上傳的檔案大小不能超過 5MB',
      })
      return false
    }
    if (props.cropper) {
      state.value.imageName = uploadFile.raw.name.split('.')[0]
      state.value.imageUrl = URL.createObjectURL(uploadFile.raw)
      state.value.dialogVisible = true
    } else {
      actions.getBase64(uploadFile.raw).then((res: any) => {
        imgList.value.push(res)
        emit('update:modelValue', imgList.value)
      })
    }
  },

  handleCropper: () => {
    cropper.value?.getCropData(async (data: string) => {
      imgList.value.push(data)
      emit('update:modelValue', imgList.value)
    })
    state.value.dialogVisible = false
  },

  /*
   * @description: 轉base64
   */
  getBase64: (file: any) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      let fileResult: any
      reader.readAsDataURL(file)
      reader.onload = function () {
        fileResult = reader.result
      }
      reader.onerror = function (error) {
        reject(error)
      }
      reader.onloadend = function () {
        resolve(fileResult)
      }
    })
  },
  base64ToBlob: (data: any) => {
    let arr = data.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = window.atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  },

  handleDrag: () => {
    const conf = {
      animation: 250, // ms, number 单位：ms，定义排序动画的时间
      draggable: 'li',
      onStart: function (e: any) {
        imgList.value.push('')
        nextTick(() => {
          uploadRef.value?.querySelector('li:last-child')?.classList.add('hidden')
        })
      },
      onEnd({ newIndex, oldIndex }) {
        const currentRow = imgList.value.splice(oldIndex, 1)[0]
        imgList.value.splice(newIndex, 0, currentRow)
        imgList.value.pop()
        emit('update:modelValue', imgList.value)
      },
    }
    Sortable.create(uploadRef.value, conf)
  },
}
</script>

<style scoped lang="scss">
:deep(.el-upload--text),
:deep(.el-upload-dragger) {
  height: 100%;
}
:deep(.el-dialog__body) {
  height: calc(100% - 100px);
  width: 100%;
}
</style>
