<template>
  <div
    class="mt-8 lg:mt-0 lg:py-2 lg:px-0 lg:pb-4 flex relative lg:before:content-[''] lg:before:border-l lg:before:border-gray-300 dark:lg:before:border-gray-700 lg:before:absolute lg:before:left-0 lg:before:bottom-[calc(50%+25px)] lg:before:h-[calc(50%-25px)] lg:after:content-[''] lg:after:border-l lg:after:border-gray-300 dark:lg:after:border-gray-700 lg:after:absolute lg:after:left-0 lg:after:top-[calc(50%+25px)] lg:after:h-[calc(50%-25px)] first:lg:before:hidden last:lg:after:hidden"
  >
    <i
      class="flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 text-gray-700 dark:text-gray-300 lg:absolute lg:top-[calc(50%-25px)] lg:left-[-26px] lg:border lg:border-gray-300 dark:lg:border-gray-700 lg:bg-white dark:lg:bg-gray-900 lg:rounded-lg"
    >
      <slot name="icon"></slot>
    </i>
    <div class="flex-1 ml-4">
      <h3 class="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>
