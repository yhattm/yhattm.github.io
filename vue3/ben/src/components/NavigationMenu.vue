<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'
import { cn } from '@/lib/utils'

const route = useRoute()
const { t } = useI18n()

// Check if a route is active
const isActive = (routeName: string) => {
  return computed(() => route.name === routeName)
}
</script>

<template>
  <nav
    class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    aria-label="Main navigation"
  >
    <div class="container mx-auto px-4 py-2">
      <NavigationMenu class="mx-0 max-w-full">
        <NavigationMenuList class="flex-wrap justify-start gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink as-child :active="isActive('tools-home').value">
              <RouterLink
                to="/"
                :class="
                  cn(
                    navigationMenuTriggerStyle(),
                    isActive('tools-home').value &&
                      'bg-accent text-accent-foreground font-semibold',
                  )
                "
              >
                {{ t('nav.home') }}
              </RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink as-child :active="isActive('settings').value">
              <RouterLink
                to="/settings"
                :class="
                  cn(
                    navigationMenuTriggerStyle(),
                    isActive('settings').value && 'bg-accent text-accent-foreground font-semibold',
                  )
                "
              >
                {{ t('nav.settings') }}
              </RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink as-child :active="isActive('about').value">
              <RouterLink
                to="/about"
                :class="
                  cn(
                    navigationMenuTriggerStyle(),
                    isActive('about').value && 'bg-accent text-accent-foreground font-semibold',
                  )
                "
              >
                {{ t('nav.about') }}
              </RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink as-child :active="isActive('mrt-fare-finder').value">
              <RouterLink
                to="/mrt-fare-finder"
                :class="
                  cn(
                    navigationMenuTriggerStyle(),
                    isActive('mrt-fare-finder').value && 'bg-accent text-accent-foreground font-semibold',
                  )
                "
              >
                {{ t('nav.mrtFareFinder') }}
              </RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink as-child :active="isActive('app-info').value">
              <RouterLink
                to="/app-info"
                :class="
                  cn(
                    navigationMenuTriggerStyle(),
                    isActive('app-info').value && 'bg-accent text-accent-foreground font-semibold',
                  )
                "
              >
                {{ t('nav.appInfo') }}
              </RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </nav>
</template>