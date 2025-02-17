import { Save, Trash } from 'lucide-react';
import PropTypes from 'prop-types';

const ProfileActions = ({ onSave, onDelete }) => {
  return (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete Account
      </button>
    </div>
  );
};

ProfileActions.propTypes = {
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfileActions;
