import supabase from '../config/supabase.js';

export const addWebsite = async (req, res) => {
    const { url, title, description } = req.body;

    if (!url || !title) {
        return res.status(400).json({ message: 'URL and Title are required' });
    }

    try {
        const { data, error } = await supabase
            .from('websites')
            .insert([
                {
                    url,
                    title,
                    description,
                    status: 'pending' // Default status
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding website:', error);
            return res.status(500).json({ message: 'Failed to add website' });
        }

        res.status(201).json({ message: 'Website added successfully', website: data });
    } catch (err) {
        console.error('Server error adding website:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const approveWebsite = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('websites')
            .update({ status: 'approved' })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error approving website:', error);
            return res.status(500).json({ message: 'Failed to approve website' });
        }

        res.json({ message: 'Website approved successfully', website: data });
    } catch (err) {
        console.error('Server error approving website:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteWebsite = async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('websites')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting website:', error);
            return res.status(500).json({ message: 'Failed to delete website' });
        }

        res.json({ message: 'Website deleted successfully' });
    } catch (err) {
        console.error('Server error deleting website:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getWebsites = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('websites')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching websites:', error);
            return res.status(500).json({ message: 'Failed to fetch websites' });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error fetching websites:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
