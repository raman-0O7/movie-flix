import { icons } from '@/constants/icons'
import React from 'react'
import { Image, Text, View } from 'react-native'

const Saved = () => {
  return (
    <View className='flex-1 bg-primary px-10'>
      <View className='flex items-center justify-center flex-1 flex-col gap-5'>
        <Image source={icons.save} className='size-10' tintColor={"#fff"}/>
        <Text className='text-lg font-semibold text-light-100'>Save</Text>
      </View>
    </View>
  )
}

export default Saved