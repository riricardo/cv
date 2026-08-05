function getPublicAssetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

export const resumeAssets = {
  faviconUrl: getPublicAssetUrl('favicon.svg'),
  profilePhotoUrls: {
    profile1: getPublicAssetUrl('assets/profile-1.jpg'),
    profile2: getPublicAssetUrl('assets/profile-2.jpg'),
    profile3: getPublicAssetUrl('assets/profile-3.jpg'),
  },
} as const

export function getRandomProfilePhotoUrl() {
  const profilePhotoUrls = Object.values(resumeAssets.profilePhotoUrls)

  return profilePhotoUrls[Math.floor(Math.random() * profilePhotoUrls.length)]
}
