import { ObjectId } from "mongoose";

export type CategoryType = {
    _id: ObjectId;
    name: string;
    slug: string;
    img: string;
}