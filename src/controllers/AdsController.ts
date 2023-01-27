import sharp from 'sharp';
import { Request, Response } from 'express';
import { unlink } from 'fs/promises';
import mongoose, { ObjectId } from 'mongoose';
import { FilterType } from '../types/FilterType';
import { GetAdsType } from '../types/GetAdsType';
import { AdUpdateType } from '../types/AdUpdateType';
import { UserType } from '../types/UserType';
import { CategoryType } from '../types/CategoryType';
import { AdType } from '../types/AdType';
import * as AdsService from '../services/AdsService';
import { SingleImageType } from '../types/SingleImageType';

export const adsController = {
    addAd: async (req: Request, res: Response) => {
        const user = req.user as UserType;
        let { title, price, priceneg, desc, cat } = req.body;

        if (!title || !cat)
            return res.status(400).json({ error: 'Título e/ou categoria não foram preenchidos!' });

        const catItem = await AdsService.findCategory(cat as string);
        if (!catItem)
            return res.status(400).json({ error: 'Essa categoria não existe!' });

        if (price) {
            price = price.replace('.', '').replace(',', '.').replace('R$', '');
            price = parseFloat(price);
        } else {
            price = 0;
        }

        const newAd: AdType = {
            status: true,
            idUser: user._id.toString(),
            state: user.state,
            dateCreated: new Date(),
            title,
            category: cat,
            categoryName: catItem.name,
            price,
            priceNegotiable: priceneg == 'true' ? true : false,
            description: desc,
            views: 0,
            images: [{ url: '', default: true }]
        };

        const files = req.files as Express.Multer.File[];

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const url = `${files[i].filename}.jpg`;
                await sharp(files[i].path)
                    .resize(500, 500)
                    .toFormat('jpeg')
                    .toFile(`./public/media/${files[i].filename}.jpg`);

                newAd.images.push({ url, default: false });

                await unlink(files[i].path);
            }
            newAd.images.shift();
        } else {
            return res.status(400).json({ error: 'Você precisa enviar ao menos uma imagem do seu produto!' });
        }

        if (newAd.images.length > 0) {
            newAd.images[0].default = true;
        }

        const newAdAdded = await AdsService.createAd(newAd);
        res.status(201).json(newAdAdded);
    },
    getAds: async (req: Request, res: Response) => {
        const {
            sort = 'asc',
            offset = '0',
            limit = '8',
            q,
            cat,
            state,
        } = req.query;

        const filters = { status: true } as FilterType;

        if (q) filters.title = { $regex: q, $options: 'i' };

        if (cat) {
            const c = await AdsService.findCategory(cat as string);
            if (c) filters.category = c.slug.toString();
        }

        if (state) {
            const s = await AdsService.findState(state as string);
            if (s) filters.state = s.name.toString();
        }

        let total = 0;
        const adsTotal = await AdsService.findAdsTotal(filters);
        total = adsTotal.length;

        const adsData = await AdsService.findFilteredAd(filters, sort as string, offset as string, limit as string);
        let ads: GetAdsType[] = [];

        for (let i in adsData) {
            let image = { url: `${process.env.BASE}/media/default.png` };
            type AdImage = {
                url: string;
                default: boolean;
            }
            let defaultImg = adsData[i].images.find((e: AdImage) => e.default);

            if (defaultImg)
                image = { url: `${process.env.BASE}/media/${defaultImg.url}` };

            ads.push({
                _id: adsData[i]._id,
                title: adsData[i].title,
                price: adsData[i].price,
                priceNegotiable: adsData[i].priceNegotiable,
                image
            });
        }

        res.json({ ads, total });
    },
    getAd: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { other = null } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ error: 'ID inválido!' });
        }

        let ad = await AdsService.findAd(id);
        if (!ad) return res.status(400).json({ error: 'Produto inexistente!' });
        ad.views++;
        await AdsService.updateAdViews(id, ad.views);

        let images = [];
        for (let i in ad.images) {
            images.push(`${process.env.BASE}/media/${ad.images[i].url}`);
        }

        let cat = ad.category;
        let category = await AdsService.findCategory(cat);
        let userInfo = await AdsService.findAdUser(ad.idUser) as UserType;
        let stateInfo = await AdsService.findState(ad.state);

        let others = [];
        if (other) {
            const otherData = await AdsService.findOtherAds(ad.idUser);

            for (let i in otherData) {
                if (otherData[i]._id.toString() !== ad._id.toString()) {
                    let image = `${process.env.BASE}/media/default.png`;
                    let defaultImg = otherData[i].images.find((e) => e.default);

                    if (defaultImg)
                        image = `${process.env.BASE}/media/${defaultImg.url}`;

                    others.push({
                        id: otherData[i]._id,
                        title: otherData[i].title,
                        price: otherData[i].price,
                        priceNegotiable: otherData[i].priceNegotiable,
                        image,
                    });
                }
            }
        }

        res.json({
            id: ad._id,
            title: ad.title,
            price: ad.price,
            priceNegotiable: ad.priceNegotiable,
            description: ad.description,
            dateCreated: ad.dateCreated,
            views: ad.views,
            images,
            category,
            userInfo: {
                name: userInfo.name,
                email: userInfo.email,
            },
            stateName: stateInfo,
            others,
        });
    },
    editAd: async (req: Request, res: Response) => {
        const user = req.user as UserType;
        const { id } = req.params;
        let { title, status, price, priceneg, desc, cat, images } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: 'ID inválido!' });

        const ad = await AdsService.findAd(id);
        if (!ad) return res.status(400).json({ error: 'Anúncio inexistente!' });

        const userId = user._id as ObjectId;
        if (userId.toString() !== ad.idUser.toString()) {
            return res.status(403).json({ error: 'Somente o proprietário desse anúncio pode fazer edições!' });
        }

        let updates: AdUpdateType = {};

        if (title) updates.title = title;
        if (price) {
            price = price.replace('.', '').replace(',', '.').replace('R$', '');
            price = parseFloat(price);
            updates.price = price;
        }
        if (priceneg) updates.priceNegotiable = priceneg;
        if (status) updates.status = status;
        if (desc) updates.description = desc;
        if (cat) {
            const category = await AdsService.findCategory(cat);
            if (!category) return res.status(400).json({ error: 'Categoria inexistente' });
            updates.category = category.slug.toString() as string;
            updates.categoryName = category.name;
        }
        await AdsService.updateAd(id, updates);

        const updatedImages: SingleImageType[] = [];
        const imagesToDelete = [...ad.images];
        if (images) {
            if (Array.isArray(images)) {
                const imageIndexes = [];

                for (let a in images) {
                    for (let i = 0; i < ad.images.length; i++) {
                        if (ad.images[i].url.includes(images[a])) {
                            updatedImages.push(ad.images[i]);
                        }
                    }
                }
                for (let a in images) {
                    for (let i = 0; i < ad.images.length; i++) {
                        if (ad.images[i].url.includes(images[a])) {
                            imageIndexes.push(i)
                        }
                    }
                }
                imageIndexes.sort((a, b) => b - a);
                for (let i of imageIndexes) {
                    imagesToDelete.splice(i, 1);
                }
                for (let i in imagesToDelete) {
                    await unlink(`\public/media/${imagesToDelete[i].url}`);
                }
            }
            if (!Array.isArray(images)) {

                for (let i = 0; i < ad.images.length; i++) {
                    if (ad.images[i].url.includes(images)) {
                        updatedImages.push(ad.images[i]);
                    }
                }

                let index = 0;

                for (let i = 0; i < ad.images.length; i++) {
                    if (ad.images[i].url.includes(images)) {
                        index = i;
                    }
                }
                imagesToDelete.splice(index, 1);
                for (let i in imagesToDelete) {
                    await unlink(`\public/media/${imagesToDelete[i].url}`);
                }
            }
        } else {
            for (let i in imagesToDelete) {
                await unlink(`\public/media/${imagesToDelete[i].url}`);
            }
        }
        
        const files = req.files as Express.Multer.File[];
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const url = `${files[i].filename}.jpg`;
                await sharp(files[i].path)
                    .resize(500, 500)
                    .toFormat('jpeg')
                    .toFile(`./public/media/${files[i].filename}.jpg`);
                updatedImages.push({
                    url,
                    default: false,
                });
                await unlink(files[i].path);
            }
        }
        
        updatedImages[0].default = true;

        const adId = ad._id as ObjectId;
        await AdsService.deleteAdImages(adId.toString());
        await AdsService.updateAdImages(adId.toString(), updatedImages);

        res.json({ msg: 'Atualizado com sucesso!' });
    },
    deleteAd: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as UserType;

        if (!id)
            return res.status(400).json({ error: 'Envie o ID do produto!' });

        if (!mongoose.Types.ObjectId.isValid(id as string))
            return res.status(400).json({ error: 'ID inválido!' });

        const ad = await AdsService.findAd(id);
        if (!ad) return res.status(400).json({ error: 'Anúncio inexistente!' });

        const userId = user._id as ObjectId;
        if (ad.idUser.toString() !== userId.toString())
            return res.status(403).json({ error: 'Somente o proprietário pode remover este anúncio!' });

        await AdsService.deleteAd(id);

        res.json({ msg: 'Anúncio removido com sucesso!' });
    },
    getCategories: async (req: Request, res: Response) => {
        const cats: CategoryType[] = await AdsService.findAllCategories();
        let categories: CategoryType[] = [];

        for (let i in cats) {
            categories.push({
                ...cats[i],
                img: `${process.env.BASE}/assets/images/${cats[i].slug}.png` as string,
            });
        }

        res.json({ categories });
    },
};
