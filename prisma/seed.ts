import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await Promise.all([
    prisma.source.create({
      data: { code: 'estadao', name: 'Estadão', avatarUrl: 'https://www.estadao.com.br/pf/resources/favicon.ico?d=765' }
    }),
    prisma.source.create({
      data: { code: 'folha', name: 'Folha de São Paulo', avatarUrl: 'https://f.i.uol.com.br/hunting/folha/1/common/icons/favicon-192.png' }
    }),
    prisma.source.create({
      data: { code: 'valor', name: 'Valor', avatarUrl: 'https://s2.glbimg.com/IBdhwkm55qu3A3oF5Z-kL2byufY=/196x196/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2018/e/e/PAMa3oQXOPBUOsGgFyFw/valor-tenant-icon.png' }
    }),
    prisma.source.create({
      data: { code: 'uol', name: 'Uol', avatarUrl: 'https://conteudo.imguol.com.br/c/_layout/favicon/uol2021.ico' }
    }),
    prisma.source.create({
      data: { code: 'g1', name: 'G1', avatarUrl: 'https://s2-g1.glbimg.com/LsuKXSXhHyq6vHO3DX_fXzijkCg=/196x196/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2021/H/w/YbA657S3aYVfC0P9wboQ/g1-favicon.png' }
    })
  ])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
