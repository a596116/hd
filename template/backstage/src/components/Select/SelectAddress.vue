<template>
  <!-- 地址資料 -->
  <el-col :span="showZip ? 8 : 12" :md="countySpan">
    <el-form-item :label="props.label || countLabel" size="default" :prop="county">
      <el-select
        v-model="propsFormData.data[props.county]"
        :placeholder="canEdit ? '請選擇縣市' : '尚未選擇'"
        :disabled="canEdit"
        class="w-full-select w-full"
        @change="actions.handleChangeAddressCounty">
        <el-option
          v-for="c in state.city"
          :key="c.CityName"
          :label="c.CityName"
          :value="c.CityName">
        </el-option>
      </el-select>
    </el-form-item>
  </el-col>

  <el-col :span="showZip ? 8 : 12" :md="districtSpan">
    <el-form-item
      :label="districtLabel"
      size="default"
      :prop="district"
      :class="{ 'remove-label-width': isEmpty(districtLabel) }">
      <el-select
        v-model="propsFormData.data[props.district]"
        :placeholder="canEdit ? '請選擇區域' : '尚未選擇'"
        :disabled="canEdit"
        class="w-full-select w-full"
        @focus="actions.handleFocusAddressArea"
        @change="actions.handleChangeAddressArea">
        <el-option
          v-for="a in state.areas"
          :key="a.AreaName"
          :label="a.AreaName"
          :value="a.AreaName">
        </el-option>
      </el-select>
    </el-form-item>
  </el-col>

  <el-col v-if="showZip" :span="8" :md="zipSpan">
    <el-form-item :label="zipLabel" size="default" :prop="zip">
      <el-input
        v-model="propsFormData.data[props.zip]"
        :disabled="canEdit"
        class="w-full"
        :placeholder="canEdit ? '郵遞區號' : '尚未填寫'"
        readonly />
    </el-form-item>
  </el-col>

  <el-col v-if="showAddress" :span="24" :md="addressSpan">
    <el-form-item
      :prop="address"
      :label="addressLabel"
      size="default"
      :error="propsFormData.errors[props.address]"
      clearable>
      <el-input
        v-model.trim="propsFormData.data[props.address]"
        :placeholder="canEdit ? '請填寫詳細地址' : '尚未填寫'"
        :disabled="canEdit"></el-input>
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
import cityJson from '@/assets/json/city.json'
import { isEmpty, compact } from 'lodash-es'

// ----------- props -----------
const props = withDefaults(
  defineProps<{
    label?: string
    county?: string
    district?: string
    address?: string
    zip?: string
    countLabel?: string
    districtLabel?: string
    addressLabel?: string
    zipLabel?: string
    canEdit?: boolean
    sameAddress?: boolean
    countySpan?: number
    districtSpan?: number
    addressSpan?: number
    zipSpan?: number
    showZip?: boolean
    showAddress?: boolean
  }>(),
  {
    label: '',
    county: 'county',
    district: 'district',
    address: 'address',
    zip: 'zip_code',
    countLabel: '縣市',
    districtLabel: '',
    addressLabel: '地址',
    zipLabel: '郵遞區號',
    canEdit: false,
    sameAddress: false,
    countySpan: 8,
    districtSpan: 8,
    zipSpan: 8,
    addressSpan: 24,
    showZip: true,
    showAddress: true,
  },
)

// ----------- computed ----------
const propsFormData = defineModel<any>('formData', { required: true, default: () => {} })

// ----------- data -----------
const state = ref({
  city: cityJson,
  areas: [],
})

// ----------- methods ----------
const actions = {
  handleChangeAddressCounty: () => {
    propsFormData.value.data[props.district] = ''
    if (propsFormData.value.data[props.county] !== '') {
      const findAreas = state.value.city.find(
        (item) => item.CityName === propsFormData.value.data[props.county],
      )
      state.value.areas = findAreas.AreaList
    }
  },

  handleChangeAddressArea: () => {
    const selected = state.value.areas.map((area) => {
      if (area.AreaName === propsFormData.value.data[props.district]) {
        return area.ZipCode
      }
    })
    const selected_zip = compact(selected).pop()
    propsFormData.value.data[props.zip] = selected_zip
  },

  handleFocusAddressArea: () => {
    if (propsFormData.value.data[props.county] !== '' && isEmpty(state.value.areas)) {
      const findAreas = state.value.city.find(
        (item) => item.CityName === propsFormData.value.data[props.county],
      )
      state.value.areas = findAreas.AreaList
    }
  },
}
</script>
