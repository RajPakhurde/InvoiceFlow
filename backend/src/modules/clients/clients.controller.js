import * as clientsService from './clients.service.js';

export const getClientsHandler = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const clients = await clientsService.getClients(req.user.id, search);
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

export const getClientByIdHandler = async (req, res, next) => {
  try {
    const client = await clientsService.getClientById(req.user.id, req.params.id);
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

export const createClientHandler = async (req, res, next) => {
  try {
    const client = await clientsService.createClient(req.user.id, req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

export const updateClientHandler = async (req, res, next) => {
  try {
    const client = await clientsService.updateClient(req.user.id, req.params.id, req.body);
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

export const deleteClientHandler = async (req, res, next) => {
  try {
    await clientsService.deleteClient(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
