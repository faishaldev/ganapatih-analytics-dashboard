import CustomSelect from '../molecules/CustomSelect';
import MapContent from '../molecules/MapContent';
import SectionLayout from '../templates/SectionLayout';

export default function MapSection() {
  return (
    <SectionLayout>
      <CustomSelect />
      <MapContent />
    </SectionLayout>
  );
}
