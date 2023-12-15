<template>
  <div>
    <div v-if="disabled" class="">
      <div v-for="(item, index) in imgList" :key="index" class="">
        <div class="flex flex-col w-full">
          <div v-if="item?.type == 'image'" class="flex justify-center p-8">
            <img
              :src="item?.img"
              :alt="item?.alt"
              class="h-full max-h-[50px] min-h-[50px] w-full object-contain" />
          </div>
          <div class="flex max-w-[146px] items-baseline gap-x-1 bg-gray-200 px-2 py-1">
            <small class="truncate">{{ item?.alt }}</small>
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex flex-col items-center w-full h-full delay-75 bg-gray-300">
            <div class="w-full p-3">
              <div class="flex items-baseline gap-x-1">
                <p class="text-sm text-gray-900 truncate">
                  {{ item?.alt }}
                </p>
              </div>
            </div>
            <div class="flex justify-center p-3 mt-auto gap-x-1">
              <div
                class="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-lg cursor-pointer hover:bg-opacity-70"
                @click="actions.handleDownload(item.img, item.alt)">
                <svg-icon :name="'file-download-cloud'" class="w-5 h-5"></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="w-full h-full">
      <draggable
        v-if="imgList.length > 0"
        v-model="imgList"
        class="h-full border-2 rounded-md"
        ghost-class="ghost"
        item-key="img"
        @start="state.drag = true"
        @end="state.drag = false"
        @change="actions.handleUpdateList(imgList)">
        <template #item="{ element }">
          <section class="relative w-full h-full">
            <article class="flex flex-col justify-between w-full h-full">
              <div class="flex justify-center w-full h-full">
                <el-image
                  :src="element?.img"
                  :alt="element?.alt"
                  fit="contain"
                  class="w-full h-full"></el-image>
              </div>
              <div
                v-if="showAlt"
                class="flex h-[30px] w-full items-baseline gap-x-1 bg-gray-200 px-2 py-1">
                <small class="truncate">{{ element?.alt }}</small>
              </div>
            </article>

            <article
              class="absolute top-0 flex flex-col w-full h-full duration-300 opacity-0 hover:opacity-100">
              <div class="flex flex-col items-center w-full h-full delay-75 bg-gray-300/70">
                <div class="flex justify-center p-3 mt-auto text-white gap-x-1">
                  <div
                    v-if="element.alt"
                    class="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-lg cursor-pointer hover:bg-opacity-70"
                    @click="actions.handleDownload(element.img, element.alt)">
                    <svg-icon name="download-image" class="w-5 h-5"></svg-icon>
                  </div>
                  <div
                    class="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-lg cursor-pointer hover:bg-opacity-70"
                    @click="actions.handleDelete(element?.alt)">
                    <svg-icon name="delete"></svg-icon>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </template>
      </draggable>
      <el-upload
        v-if="imgList.length < max"
        class="h-full"
        action="#"
        drag
        :multiple="true"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="actions.handleUpload">
        <template #trigger>
          <div class="flex items-center justify-center w-full h-full">
            <svg-icon name="plus"></svg-icon>
          </div>
        </template>
      </el-upload>
    </div>
    <el-dialog v-model="state.dialogVisible" class="relative h-2/3">
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
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const props = defineProps({
  title: { type: String, default: '' },
  max: {
    type: Number,
    default: 10,
  },
  list: {
    type: Array,
    default: () => [],
  },
  param: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showAlt: {
    type: Boolean,
    default: true,
  },
  cropper: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:list', 'on-change'])
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

const imgList: any = computed({
  get: () => props.list || [{ img: '', alt: '' }],
  set: (val) => {
    emit('update:list', val)
    emit('on-change', val)
  },
})

const actions = {
  handleUpdateList: (list: any) => {
    console.log(list)
    emit('on-change', list)
  },

  /**
   * @description 刪除檔案
   */
  handleDelete(alt: any) {
    const filterData = imgList.value.filter((el: any) => el?.alt != alt)
    emit('on-change', filterData)
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
      ElMessage({
        showClose: true,
        message: '下載發生錯誤，請稍後再試',
        type: 'error',
      })
    }
  },

  handleUpload: (uploadFile: any) => {
    if (uploadFile.raw?.type !== 'image/jpeg' && uploadFile.raw?.type !== 'image/png') {
      ElMessage.error('上傳的檔案類型不符合(jpg, png)')
      return false
    } else if (uploadFile.raw?.size / 1024 / 1024 > 5) {
      ElMessage.error('上傳的檔案大小不能超過 5MB')
      return false
    }
    if (props.cropper) {
      state.value.imageName = uploadFile.raw.name.split('.')[0]
      state.value.imageUrl = URL.createObjectURL(uploadFile.raw)
      state.value.dialogVisible = true
    } else {
      actions.getBase64(uploadFile.raw).then((res: any) => {
        imgList.value.push({ alt: uploadFile.raw.name, img: res })
        emit('on-change', imgList.value)
      })
    }
  },

  handleCropper: () => {
    cropper.value?.getCropData(async (data: string) => {
      imgList.value.push({ alt: state.value.imageName, img: data })
      emit('on-change', imgList.value)
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
