export default async function notarizing(context) {
  const { electronPlatformName } = context;
  
  if (electronPlatformName !== 'darwin') {
    console.log('Skipping notarization - not building for macOS');
    return;
  }
  
  console.log('Notarization would run here for macOS builds');
}