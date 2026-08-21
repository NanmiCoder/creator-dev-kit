/* Screenshot verification harness (dev tool) */
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:5199/'

const shots = process.argv[2] ? process.argv[2].split(',') : ['base', 'tooltip', 'drawer', 'palette', 'mobile', 'tablet']

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--disable-features=Translate', '--hide-scrollbars'],
})

async function newPage(width, height) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  return page
}

for (const kind of shots) {
  if (kind === 'base') {
    const page = await newPage(1440, 900)
    await page.goto(BASE + '?shot=base', { waitUntil: 'networkidle2', timeout: 30000 })
    await page.waitForSelector('.map-veh', { timeout: 15000 })
    await new Promise((r) => setTimeout(r, 2600))
    await page.screenshot({ path: '/tmp/shot-base.png' })
    await page.close()
  }

  if (kind === 'tooltip') {
    const page = await newPage(1440, 900)
    await page.goto(BASE + '?shot=tooltip', { waitUntil: 'networkidle2', timeout: 30000 })
    await page.waitForSelector('.map-veh', { timeout: 15000 })
    await new Promise((r) => setTimeout(r, 2000))
    const veh = await page.$('.map-veh')
    if (veh) {
      const box = await veh.boundingBox()
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await new Promise((r) => setTimeout(r, 700))
    }
    await page.screenshot({ path: '/tmp/shot-tooltip.png' })
    await page.close()
  }

  if (kind === 'drawer') {
    const page = await newPage(1440, 900)
    await page.goto(BASE + '?shot=drawer', { waitUntil: 'networkidle2', timeout: 30000 })
    await page.waitForSelector('.map-veh', { timeout: 15000 })
    await new Promise((r) => setTimeout(r, 2200))
    // click the risk vehicle (amber halo) — v-01 沪AD·6832
    const risk = await page.$('.map-veh[data-risk="true"]')
    if (risk) {
      const box = await risk.boundingBox()
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      await new Promise((r) => setTimeout(r, 1400))
    }
    await page.screenshot({ path: '/tmp/shot-drawer.png' })
    await page.close()
  }

  if (kind === 'palette') {
    const page = await newPage(1440, 900)
    await page.goto(BASE + '?shot=palette', { waitUntil: 'networkidle2', timeout: 30000 })
    await page.waitForSelector('.map-veh', { timeout: 15000 })
    await new Promise((r) => setTimeout(r, 2000))
    await page.keyboard.press('/')
    await new Promise((r) => setTimeout(r, 500))
    await page.keyboard.type('温控')
    await new Promise((r) => setTimeout(r, 500))
    await page.screenshot({ path: '/tmp/shot-palette.png' })
    await page.close()
  }

  if (kind === 'mobile') {
    const page = await newPage(390, 844)
    await page.goto(BASE + '?shot=mobile', { waitUntil: 'networkidle2', timeout: 30000 })
    await page.waitForSelector('.map-veh', { timeout: 15000 })
    await new Promise((r) => setTimeout(r, 2400))
    await page.screenshot({ path: '/tmp/shot-mobile.png' })
    await page.close()
  }

  if (kind === 'tablet') {
    const page = await newPage(768, 1024)
    await page.goto(BASE + '?shot=tablet', { waitUntil: 'networkidle2', timeout: 30000 })
    await page.waitForSelector('.map-veh', { timeout: 15000 })
    await new Promise((r) => setTimeout(r, 2400))
    await page.screenshot({ path: '/tmp/shot-tablet.png' })
    await page.close()
  }

  console.log('done: ' + kind)
}

await browser.close()
