'use strict';

const Island = require('../models/island');
const User = require('../models/user');
const Category = require('../models/category');
const ImageStore = require('../utils/image-store');

const Islands = {
    home: {
        handler: async function(request, h) {
            const categories = await Category.find().lean();
            return h.view('home', { title: 'Add an Island', categories: categories });
        }
    },
    report: {
        handler: async function(request, h) {
            const user = await User.findById(request.auth.credentials.id);
            //const islands = await Island.find({member:user}).populate('member').populate('category').lean();
            const islands = await Island.find().populate('member').populate('category').lean();

            try {
                return h.view('report', {
                    title: 'Islands of Ireland',
                    islands: islands,
                })
            } catch (err) {
                console.log(err);
            }
            ;
        }
    },
    addIsland: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;
                const file = request.payload.imagefile;
                var image;
                if (Object.keys(file).length > 0) {
                    image = await ImageStore.uploadImage(file);
                }
                console.log(image);
                const rawCategory = request.payload.category;
                const category = await Category.findOne({
                    category: rawCategory
                });

                const newIsland = new Island({
                    name: data.name,
                    description: data.description,
                    member: user._id,
                    category: category._id,
                    image: image.url

                });
                await newIsland.save();
                return h.redirect('/report');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        },
        payload: {
            multipart: true,
            output: 'data',
            maxBytes: 209715200,
            parse: true
        }
    },

    showIsland: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const categories = await Category.find().lean();
                const island = await Island.findById(id).populate("category").lean();
                return h.view('island_info', { title: 'Island Information', island: island, categories: categories });
            } catch (err) {
                return h.view('report', { errors: [{ message: err.message }] });
            }
        }
    },
    updateIsland: {
        handler: async function(request, h) {
            try {

                const islandEdit = request.payload;
                const id = request.params.id;
                const island = await Island.findById(id);
                island.name = islandEdit.name;
                island.description = islandEdit.description;

                const rawCategory = request.payload.category;
                const category = await Category.findOne({
                    category: rawCategory
                });
                island.category = category._id;

                await island.save();

                return h.redirect('/island_info/' + island._id);
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        },
    },
    deleteIsland: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const island = await Island.findById(id);
                console.log(`Deleting Island`);

                await island.delete();

                return h.redirect('/report');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    }
}


module.exports = Islands;