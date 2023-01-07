import sharp from "sharp";
import { Request, Response } from "express";
import Ad, { AdType } from "../models/Ad";
import Category, { CategoryType } from "../models/Category";
import User, { UserType } from "../models/User";
import { unlink } from "fs/promises";
import State, { StateType } from "../models/State";
import mongoose, { ObjectId } from "mongoose";

export const adsController = {
    addAd: async (req: Request, res: Response) => {
        const user = req.user as UserType;
        let { title, price, priceneg, desc, cat } = req.body;

        if (!title || !cat) return res.status(400).json({ error: "Título e/ou categoria não foram preenchidos!" });

        if (mongoose.Types.ObjectId.isValid(cat)) {
            const catItem = (await Category.findById(cat)) as CategoryType;
            if (!catItem) return res.status(400).json({ error: "Categoria inexistente!" });
        } else {
            return res.status(400).json({ error: "Código de categoria inválido!" });
        }

        if (price) {
            price = price.replace(".", "").replace(",", ".").replace("R$", "");
            price = parseFloat(price);
        } else {
            price = 0;
        }

        const newAd: AdType = new Ad({
            status: true,
            idUser: user._id,
            state: user.state,
            dateCreated: new Date(),
            title,
            category: cat,
            price,
            priceNegotiable: priceneg == "true" ? true : false,
            description: desc,
            views: 0,
        });

        const files = req.files as Express.Multer.File[];

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const url = `${files[i].filename}.jpg`;
                await sharp(files[i].path)
                    .resize(500, 500)
                    .toFormat("jpeg")
                    .toFile(`./public/media/${files[i].filename}.jpg`);
                
                newAd.images.push({
                    url,
                    default: false,
                });

                await unlink(files[i].path);
            }
        } else {
            return res.status(400).json({ error: "Você precisa enviar ao menos uma imagem do seu produto!" });
        }

        if (newAd.images.length > 0) {
            newAd.images[0].default = true;
        }

        await Ad.create(newAd);
        res.status(201).json({ id: newAd._id });
    },
    getAds: async (req: Request, res: Response) => {
        const {
            sort = "asc",
            offset = "0",
            limit = "8",
            q,
            cat,
            state,
        } = req.query;

        type FilterType = {
            status: boolean;
            title: Object;
            category: string;
            state: string;
        };

        const filters = { status: true } as FilterType;

        if (q) filters.title = { '$regex': q, '$options': "i" };

        if (cat) {
            const c = await Category.findOne({ slug: cat }).exec() as CategoryType;
            if (c) filters.category = c._id.toString();
        }

        if (state) {
            const s = (await State.findOne({ name: state }).exec()) as StateType;
            if (s) filters.state = s._id.toString();
        }

        let total = 0;
        const adsTotal = await Ad.find(filters).exec();
        total = adsTotal.length;

        const AdsData = await Ad.find(filters)
            .sort({ dateCreated: sort == "desc" ? -1 : 1 })
            .skip(parseInt(offset as string))
            .limit(parseInt(limit as string))
            .exec();
        
        type AdsType = {
            _id: ObjectId;
            title: string;
            price: number;
            priceNegotiable: boolean;
            image: {
                url: string;
            };
        }

        let ads: AdsType[] = [];
        
        for (let i in AdsData) {
            let image = { url: `${process.env.BASE}/media/default.jgp`};
            let defaultImg = AdsData[i].images.find((e) => e.default);

            if (defaultImg) image = { url: `${process.env.BASE}/media/${defaultImg.url}` };

            ads.push({
                _id: AdsData[i]._id,
                title: AdsData[i].title,
                price: AdsData[i].price,
                priceNegotiable: AdsData[i].priceNegotiable,
                image,
            });
        }

        res.json({ ads, total });
    },
    getAd: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { other = null } = req.query;

        if (!id) return res.status(400).json({ error: "Esse produto não existe!" });
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ error: "ID inválido!" });
        }

        const ad = await Ad.findById(id);
        if (!ad) return res.status(400).json({ error: "Produto inexistente!" });
        ad.views++;
        await Ad.updateOne({ views: ad.views });

        let images = [];
        for (let i in ad.images) {
            images.push(`${process.env.BASE}/media/${ad.images[i].url}`);
        }

        let category = await Category.findById(ad.category).exec() as CategoryType;
        let userInfo = await User.findById(ad.idUser).exec() as UserType;
        let stateInfo = await State.findById(ad.state).exec() as StateType;

        let others = [];
        if (other) {
            const otherData = await Ad.find({
                status: true,
                idUser: ad.idUser,
            }).exec();

            for (let i in otherData) {
                if (otherData[i]._id.toString() !== ad._id.toString()) {
                    let image = `${process.env.BASE}/media/default.jpg`;
                    let defaultImg = otherData[i].images.find((e) => e.default);

                    if (defaultImg) image = `${process.env.BASE}/media/${defaultImg.url}`;

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
        let { title, status, price, priceneg, desc, cat } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "ID inválido!" });

        const ad = (await Ad.findById(id).exec()) as AdType;
        if (!ad) return res.status(400).json({ error: "Anúncio inexistente!" });

        if ((user._id?.toString() as string) !== ad.idUser?.toString() as string) {
            return res.status(403).json({
                error: "Somente o proprietário desse anúncio pode fazer edições!",
            });
        }

        type UpdatesType = {
            title?: string;
            price?: number;
            priceNegotiable?: boolean;
            status?: boolean;
            description?: string;
            category?: string;
            images?: [
                {
                    url: string;
                    default: boolean;
                }
            ];
        };

        let updates: UpdatesType = {};

        if (title) updates.title = title;
        if (price) {
            price = price.replace(".", "").replace(",", ".").replace("R$", "");
            price = parseFloat(price);
            updates.price = price;
        }
        if (priceneg) updates.priceNegotiable = priceneg;
        if (status) updates.status = status;
        if (desc) updates.description = desc;
        if (cat) {
            const category = (await Category.findOne({ slug: cat }).exec()) as CategoryType;
            if (!category) return res.status(400).json({ error: "Categoria inexistente" });
            updates.category = category._id.toString() as string;
        }

        await Ad.findByIdAndUpdate(id, { $set: updates });

        const files = req.files as Express.Multer.File[];

        if (files) {
            for (let i = 0; i < files.length; i++) {
                const url = `${files[i].filename}.jpg`;
                await sharp(files[i].path)
                    .resize(500, 500)
                    .toFormat("jpeg")
                    .toFile(`./public/media/${files[i].filename}.jpg`);
                ad.images.push({
                    url,
                    default: false,
                });

                await unlink(files[i].path);
            }
        }

        await Ad.findByIdAndUpdate(
            ad._id,
            { images: ad.images }
        );

        res.json({ msg: 'Atualizado com sucesso!'});
    },
    deleteAd: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as UserType;

        if(!id) return res.status(400).json({ error: 'Envie o ID do produto!' });

        if(!mongoose.Types.ObjectId.isValid(id as string)) return res.status(400).json({ error: 'ID inválido!' });
        
        const ad = await Ad.findById(id) as AdType;
        if(!ad) return res.status(400).json({ error: 'Anúncio inexistente!' });

        if (ad.idUser.toString() !== user._id.toString()) return res.status(403).json({
            error: 'Somente o proprietário pode remover este anúncio!'
        });
        
        await Ad.findByIdAndDelete(id);
        
        res.json({ msg: 'Anúncio removido com sucesso!'});
    },
    getCategories: async (req: Request, res: Response) => {
        const cats: CategoryType[] = await Category.find({});
        let categories: CategoryType[] = [];
        
        for (let i in cats) {
            categories.push({
                ...cats[i],
                img: `${process.env.BASE}/assets/images/${cats[i].slug}.png` as string,
            });
        }

        res.json({ categories });
    }
};
